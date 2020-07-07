from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import time

# driver_chrome = webdriver.Chrome()
# driver_chromium = webdriver.Chromium()
# driver_firefox = webdriver.Firefox()

def login(driver, un, pw):

	username = driver.find_element_by_id("username")
	username.clear()
	username.send_keys(un)

	password = driver.find_element_by_id("password")
	password.clear()
	password.send_keys(pw)

	driver.find_element_by_css_selector("button").click()

def run_timing_test (driver, index):

	# Get table

	WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, '//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button')))
	driver.find_element_by_xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button').click()

	# click launch
	button = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div/div[2]/div/div/div/div/table/tbody/tr[" + str(index+1) + "]/td[5]/button")))
	button.click()

	# click OK on the time notice dialog
	button = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[2]/div[3]/div[3]/button")))
	button.click()

	# wait for provisioning
	status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text

	while not status == 'provisioning':
		time.sleep(2)
		assert(status == 'queueing')
		status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text
		print(status)

	t0 = time.time()

	while not status == 'running':
		time.sleep(2)
		assert(status == 'provisioning')
		status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text
		print(status)

	t1 = time.time()

	# /html/body/div[3]/div[3]/div[7]/button
	WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[6]/button")))
	driver.find_element_by_xpath("//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[6]/button").click()
	
	WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[3]/div[3]/div[7]/button")))
	driver.find_element_by_xpath("/html/body/div[3]/div[3]/div[7]/button").click()

	return t1-t0

def main ():

	run_names = []

	# Assemble list of user accounts from file. 

	with open('accts.txt', 'r', encoding='utf-8-sig') as f:
		accounts = f.readlines()
		f.close()

	accounts = [[x.split(",")[0][1:-1], x.split(",")[1].strip()[1:-1]] for x in accounts]


	# Open webpage and determine the combinations to run

	options = webdriver.ChromeOptions()
	options.add_argument("--start-maximized")
	driver_chrome = webdriver.Chrome(options=options)
	driver_chrome.get("https://fett.securehardware.org/")

	login(driver_chrome, accounts[0][0], accounts[0][1])

	# Logged in OK, let's check the options for login

	WebDriverWait(driver_chrome,100).until(EC.presence_of_element_located((By.XPATH, '//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button')))
	driver_chrome.find_element_by_xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button').click()

	table = WebDriverWait(driver_chrome,100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div/div[2]/div/div/div/div/table/tbody")))
	rows = table.find_elements(By.TAG_NAME, "tr")

	for row in rows:
		col = row.find_elements(By.TAG_NAME, "td") #note: index start from 0, 1 is col 2
		tl=[]
		for c in col[0:4]:
			tl.append(c.text)
		run_names.append(tl)

	print("Running tests on:", run_names)

	driver_chrome.close()

	#for run_index in range (0, len(run_names)):

	options = webdriver.ChromeOptions()
	options.add_argument("--start-maximized")
	driver_chrome = webdriver.Chrome(options=options)
	driver_chrome.get("https://fett.securehardware.org/")
	login(driver_chrome, accounts[0][0], accounts[0][1])
	a = run_timing_test(driver_chrome, 0)

	print(a)
	time.sleep(1000000)


if __name__ == "__main__":
	main()