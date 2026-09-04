import os
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from database import get_db
from models import User
from auth import create_access_token

from dotenv import load_dotenv

router = APIRouter(prefix="/api/auth", tags=["oauth"])

env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")

def _get_env(key: str, default: str = "") -> str:
    load_dotenv(dotenv_path=env_path, override=True)
    val = os.getenv(key, default)
    return val.strip().strip("'\"") if val else default

def get_frontend_url() -> str:
    return _get_env("FRONTEND_URL", "http://localhost:3000")

def get_google_config():
    return {
        "client_id": _get_env("GOOGLE_CLIENT_ID"),
        "client_secret": _get_env("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": _get_env("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback"),
    }

def get_linkedin_config():
    return {
        "client_id": _get_env("LINKEDIN_CLIENT_ID"),
        "client_secret": _get_env("LINKEDIN_CLIENT_SECRET"),
        "redirect_uri": _get_env("LINKEDIN_REDIRECT_URI", "http://localhost:8000/api/auth/linkedin/callback"),
    }


# ── Helpers ───────────────────────────────────────────

def _get_or_create_oauth_user(db: Session, email: str, provider: str) -> User:
    """Find existing user by email or create a new OAuth user."""
    user = db.query(User).filter(User.email == email).first()
    if user:
        # If user exists but was registered via email/password, allow OAuth login too
        return user
    # Create new OAuth user (no password)
    new_user = User(
        email=email,
        hashed_password=None,
        auth_provider=provider,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def _build_error_redirect(error_msg: str) -> RedirectResponse:
    """Redirect to frontend callback with error message."""
    params = urlencode({"error": error_msg})
    return RedirectResponse(url=f"{get_frontend_url()}/auth/callback?{params}")


def _build_success_redirect(token: str) -> RedirectResponse:
    """Redirect to frontend callback with JWT token."""
    params = urlencode({"token": token})
    return RedirectResponse(url=f"{get_frontend_url()}/auth/callback?{params}")


# ══════════════════════════════════════════════════════
#  GOOGLE OAUTH
# ══════════════════════════════════════════════════════

@router.get("/google")
def google_login():
    """Redirect user to Google's OAuth 2.0 consent screen."""
    cfg = get_google_config()
    if not cfg["client_id"]:
        raise HTTPException(status_code=500, detail="Google OAuth is not configured. Set GOOGLE_CLIENT_ID in .env")

    params = urlencode({
        "client_id": cfg["client_id"],
        "redirect_uri": cfg["redirect_uri"],
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    })
    return RedirectResponse(url=f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@router.get("/google/callback")
def google_callback(code: str = None, error: str = None, db: Session = Depends(get_db)):
    """Handle Google OAuth callback — exchange code for tokens, get user info."""
    if error:
        return _build_error_redirect(f"Google auth denied: {error}")

    if not code:
        return _build_error_redirect("No authorization code received from Google")

    cfg = get_google_config()

    # Exchange code for tokens
    try:
        token_response = httpx.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": cfg["client_id"],
                "client_secret": cfg["client_secret"],
                "redirect_uri": cfg["redirect_uri"],
                "grant_type": "authorization_code",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=10.0,
        )
        token_data = token_response.json()

        if "error" in token_data:
            return _build_error_redirect(f"Google token error: {token_data.get('error_description', token_data['error'])}")

    except httpx.HTTPError as e:
        return _build_error_redirect(f"Failed to reach Google: {str(e)}")

    # Get user info
    try:
        access_token = token_data["access_token"]
        userinfo_response = httpx.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10.0,
        )
        userinfo = userinfo_response.json()

        if "email" not in userinfo:
            return _build_error_redirect("Could not retrieve email from Google account")

    except httpx.HTTPError as e:
        return _build_error_redirect(f"Failed to get Google user info: {str(e)}")

    # Get or create user and generate JWT
    user = _get_or_create_oauth_user(db, userinfo["email"], "google")
    jwt_token = create_access_token(data={"sub": user.email})
    return _build_success_redirect(jwt_token)


# ══════════════════════════════════════════════════════
#  LINKEDIN OAUTH
# ══════════════════════════════════════════════════════

@router.get("/linkedin")
def linkedin_login():
    """Redirect user to LinkedIn's OAuth 2.0 consent screen."""
    cfg = get_linkedin_config()
    if not cfg["client_id"]:
        raise HTTPException(status_code=500, detail="LinkedIn OAuth is not configured. Set LINKEDIN_CLIENT_ID in .env")

    params = urlencode({
        "response_type": "code",
        "client_id": cfg["client_id"],
        "redirect_uri": cfg["redirect_uri"],
        "scope": "openid profile email",
    })
    return RedirectResponse(url=f"https://www.linkedin.com/oauth/v2/authorization?{params}")


@router.get("/linkedin/callback")
def linkedin_callback(code: str = None, error: str = None, db: Session = Depends(get_db)):
    """Handle LinkedIn OAuth callback — exchange code for tokens, get user info."""
    if error:
        return _build_error_redirect(f"LinkedIn auth denied: {error}")

    if not code:
        return _build_error_redirect("No authorization code received from LinkedIn")

    cfg = get_linkedin_config()

    # Exchange code for access token
    try:
        token_response = httpx.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "client_id": cfg["client_id"],
                "client_secret": cfg["client_secret"],
                "redirect_uri": cfg["redirect_uri"],
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=10.0,
        )
        token_data = token_response.json()

        if "error" in token_data:
            return _build_error_redirect(f"LinkedIn token error: {token_data.get('error_description', token_data['error'])}")

    except httpx.HTTPError as e:
        return _build_error_redirect(f"Failed to reach LinkedIn: {str(e)}")

    # Get user info via OpenID Connect userinfo endpoint
    try:
        access_token = token_data["access_token"]
        userinfo_response = httpx.get(
            "https://api.linkedin.com/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10.0,
        )
        userinfo = userinfo_response.json()

        email = userinfo.get("email")
        if not email:
            return _build_error_redirect("Could not retrieve email from LinkedIn account")

    except httpx.HTTPError as e:
        return _build_error_redirect(f"Failed to get LinkedIn user info: {str(e)}")

    # Get or create user and generate JWT
    user = _get_or_create_oauth_user(db, email, "linkedin")
    jwt_token = create_access_token(data={"sub": user.email})
    return _build_success_redirect(jwt_token)
