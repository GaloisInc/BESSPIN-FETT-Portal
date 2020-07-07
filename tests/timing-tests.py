from selenium import webdriver

# driver_chrome = webdriver.Chrome()
# driver_chromium = webdriver.Chromium()
# driver_firefox = webdriver.Firefox()


# Assemble list of user accounts from file. 

with open('accts.txt', 'r', encoding='utf-8-sig') as f:
	accounts = f.readlines()
	f.close()

accounts = [[x.split(",")[0][1:-1], x.split(",")[1].strip()[1:-1]] for x in accounts]


# Open webpage and determine the combinations to run

driver_chrome = webdriver.Chrome()
driver_chrome.get("https://fett.securehardware.org/")

username = driver_chrome.find_element_by_id("username")
username.clear()
username.send_keys(accounts[0][0])

password = driver_chrome.find_element_by_id("password")
password.clear()
password.send_keys(accounts[0][1])

driver_chrome.find_element_by_css_selector("button").click()

#driver_chrome.close()