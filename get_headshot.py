import importlib.util
import subprocess

packages = ['selenium', 'webdriver_manager', 'ipywidgets']


def install_package(package_name):
    if importlib.util.find_spec(package_name) is None:
        subprocess.run(["pip", "install", package_name])
    else:
        pass

# Replace 'package_name' with the name of the package you want to install
for package in packages:
    install_package(package)


from selenium import webdriver
import time
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import pandas as pd
from collections import defaultdict

player = pd.read_csv('cleaned_baseball_data.csv')
names = [i.replace('\xa0', ' ') for i in player['Name'][:789]]
name_src = defaultdict(lambda: "")

url = 'https://www.mlb.com/players'

chromedriver_path = 'C:\\Users\\ChenXi\\Desktop\\DS4200\\project-siraj-marco-vivek\\chromedriver.exe'
options = webdriver.ChromeOptions()
options.add_argument('--headless')
driver = webdriver.Chrome(executable_path=chromedriver_path, options=options)

def get_headshot(name, driver, url, i):
    #options.add_argument('--disable-extensions')
    #options.add_argument('--disable-infobars')
    #options.add_argument('--disable-plugins-discovery')
    #options.add_argument('--disable-blink-features=AutomationControlled')
    #options.add_argument('--disable-dev-shm-usage')
    #options.add_argument('--no-sandbox')
    #options.add_argument('--disable-gpu')
    #options.add_argument('--disable-setuid-sandbox')
    #options.add_argument('--disable-popup-blocking')
    #options.add_argument('--ignore-certificate-errors')
    #options.add_argument('--disable-web-security')
    #options.add_argument('--disable-site-isolation-trials')
    #options.add_argument('--disable-features=IsolateOrigins,site-per-process')
    #options.add_argument('--incognito')
    #options.add_argument('--disable-cookies')

    driver.get(url)

    #time.sleep(1)

    #try:
        #cookie = driver.find_element(By.ID, 'onetrust-accept-btn-handler')
        #cookie.click()
    #except:
        #pass

    try:

        player_info = driver.find_element(By.PARTIAL_LINK_TEXT, name)

        player_info.click()

        time.sleep(1)

        bg = driver.find_element(By.XPATH, '/html/body/main/section/header')

        link = bg.get_attribute('data-img-x')

        print(link)

    except:
        link = 'none'

    name_src[name] = link

    print(f'{i} /789')

#name_l = ['CJ Abrams']
for i in range(len(names)):
    get_headshot(names[i], driver, url, i)

df = pd.DataFrame([name_src])

df.to_csv('bg_src.csv', index=False)
