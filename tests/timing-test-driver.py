from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import time
import os
from subprocess import Popen

# driver = webdriver.Chrome()
# driver_chromium = webdriver.Chromium()
# driver_firefox = webdriver.Firefox()

def main ():

	run_names = []

	# Assemble list of user accounts from file. 

	with open('accts.txt', 'r', encoding='utf-8-sig') as f:
		accounts = f.readlines()
		f.close()

	accounts = [[x.split(",")[0][1:-1], x.split(",")[1].strip()[1:-1]] for x in accounts]


	# Open webpage and determine the combinations to run

	driver = webdriver.Chrome()
	driver.get("https://fett.securehardware.org/")

	username = driver.find_element_by_id("username")
	username.clear()
	username.send_keys(accounts[0][0])

	password = driver.find_element_by_id("password")
	password.clear()
	password.send_keys(accounts[0][1])

	driver.find_element_by_css_selector("button").click()

	# Logged in OK, let's check the options for login

	WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH, '//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button')))
	driver.find_element_by_xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button').click()

	table = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div/div[2]/div/div/div/div/table/tbody")))
	rows = table.find_elements(By.TAG_NAME, "tr")

	for row in rows:
		col = row.find_elements(By.TAG_NAME, "td") #note: index start from 0, 1 is col 2
		tl=[]
		for c in col[0:4]:
			tl.append(c.text)
		run_names.append(tl)

	print("Running tests on:", run_names)

	driver.close()

	for x in range (0,4):
		for run_index in range (0, len(run_names)):
			acct = accounts.pop()

			cmd = "python3 timing-test-slave.py " + str(run_index) + " " + '-'.join(run_names[run_index][1:]) + " " + acct[0] + " '" + acct[1] + "' &"

			print(cmd)
			#os.system("python3 timing-test-slave.py " + str(run_index) + " " + ''.join(run_names[run_index]) + " " + accounts[run_index][0] + " " + accounts[run_index][1] + " &""python3 timing-test-slave.py " + str(run_index) + " " + ''.join(run_names[run_index]) + " " + accounts[run_index][0] + " " + accounts[run_index][1] + " &")
			proc = Popen([cmd], shell=True, stdin=None, stdout=None, stderr=None, close_fds=True)
			time.sleep(5)

if __name__ == "__main__":
	main()