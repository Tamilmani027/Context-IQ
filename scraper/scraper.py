from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import json
import os
import time 



def setup_driver(): #Creates and returns a Selenium WebDriver instance
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    return driver

def get_star_rating(class_list):
    star_map = {"One":1,"Two":2,"Three":3,"Four":4,"Five":5}
    star_value = class_list[1]
    return star_map.get(star_value, 0)


def scrape_book_detail(driver, url): #takes the driver and a book's detail page URL
    driver.get(url)
    time.sleep(0.5)
    soup=BeautifulSoup(driver.page_source,"html.parser")
    desc_tag = soup.find("div", id="product_description")
    if desc_tag:
      description = desc_tag.find_next_sibling("p").text.strip()
    else:
      description = ""

    table = soup.find("table")
    rows = table.find_all("tr")

    details = {}
    for row in rows:
        label = row.th.text.strip()
        value = row.td.text.strip()
        details[label] = value

    upc = details.get("UPC", "")
    availability = details.get("Availability", "")
    num_reviews = int(details.get("Number of reviews", "0"))
    return {
      "description": description,
      "upc": upc,
      "availability": availability,
      "num_reviews": num_reviews
    }

def scrape_listing_page(driver, page_number):
  url=f"http://books.toscrape.com/catalogue/page-{page_number}.html"
  driver.get(url)
  time.sleep(1)
  soup=BeautifulSoup(driver.page_source,"html.parser")
  books=soup.find_all("article",class_="product_pod")
  results=[]
  for book in books:
    title=book.h3.a["title"]
    price_text=book.find("p",class_="price_color").text.strip()
    price=float(price_text.replace("£",""))
    rating_class=book.find("p",class_="star-rating")["class"]
    rating=get_star_rating(rating_class)
    href=book.h3.a["href"].replace("../","")
    detail_url="http://books.toscrape.com/catalogue/"+href
    book_dict = {
        "title": title,
        "price": price,
        "rating": rating,
        "url": detail_url
    }
    results.append(book_dict)
  return results

def scrape_all_books(max_pages=2):
  driver=setup_driver()
  all_books=[]
  for i in range(1,max_pages+1):
    print(f"Scraping page {i}")
    book=scrape_listing_page(driver,i)
    for each in book:
      detail=scrape_book_detail(driver,each["url"])
      merged={**each,**detail}
      all_books.append(merged)
  driver.quit()
  return all_books

def save_to_json(books, filepath):
  folder=os.path.dirname(filepath)
  os.makedirs(folder, exist_ok=True)
  with open(filepath,"w",encoding="utf-8") as f:
    json.dump(books,f,indent=4,ensure_ascii=False)
  print(f"Saved {len(books)} books to {filepath}")


def main():
  books=scrape_all_books(max_pages=2)
  save_to_json(books,"data/books.json")
  print(f"Done {len(books)} books scraped.")

if __name__=="__main__":
  main()


     





