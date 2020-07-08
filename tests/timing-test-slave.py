#!/usr/bin/python3

# Selenium
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

# Other
import time
import sys
import os
from datetime import datetime

# Return Current Time
def ct():
	now = datetime.now()
	return now.strftime("%H:%M:%S")

if __name__ == "__main__":

	print("[", os.getpid(), "@", ct(), "]", "Child Started with Arguments:", sys.argv[1:5])

	# Parse Arguments
	index = int(sys.argv[1])
	name = sys.argv[2]
	un = sys.argv[3]
	pw = sys.argv[4]

	# Start Webdriver
	print("[", os.getpid(), "@", ct(), "]", "Starting WebDriver")
	options = webdriver.ChromeOptions()
	options.add_argument("--start-maximized")
	driver = webdriver.Chrome(options=options)
	driver.get("https://fett.securehardware.org/")

	print("[", os.getpid(), "@", ct(), "]", "Started WebDriver, Logging In")

	username = driver.find_element_by_id("username")
	username.clear()
	username.send_keys(un)

	password = driver.find_element_by_id("password")
	password.clear()
	password.send_keys(pw)

	driver.find_element_by_css_selector("button").click()

	# Get table
	print("[", os.getpid(), "@", ct(), "]", "Logged In, Getting Table")
	WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, '//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button')))
	driver.find_element_by_xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button').click()

	# Click launch
	print("[", os.getpid(), "@", ct(), "]", "Launching Instance")
	button = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div/div[2]/div/div/div/div/table/tbody/tr[" + str(index+1) + "]/td[5]/button")))
	button.click()

	# click OK on the time notice dialog
	button = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[2]/div[3]/div[3]/button")))
	button.click()

	# Wait for Provisioning to Start
	print("[", os.getpid(), "@", ct(), "]", "Instance Launched, Queueing")
	status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text
	while not status == 'provisioning':
		time.sleep(2)
		assert(status == 'queueing')
		try:
			status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text
		except:
			print("[", os.getpid(), "@", ct(), "]", "Failed to get status once in Queueing")

	# Provisioning Started
	t0 = time.time()
	print("[", os.getpid(), "@", ct(), "]", "First Time Captured at", t0, ", Instance Began Provisioning")

	while not status == 'running':
		time.sleep(2)
		assert(status == 'provisioning')
		try:
			status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text
		except:
			print("[", os.getpid(), "@", ct(), "]", "Failed to get status once in Provisioning")

	# Running
	t1 = time.time()
	print("[", os.getpid(), "@", ct(), "]", "Second Time Captured at", t1, ", Instance Started")

	# Try to terminate instance
	try:

		print("[", os.getpid(), "@", ct(), "]", "Terminated Instance, Writing to File")
		WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[6]/button")))
		driver.find_element_by_xpath("//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[6]/button").click()

		WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[3]/div[3]/div[7]/button")))
		driver.find_element_by_xpath("/html/body/div[3]/div[3]/div[7]/button").click()

	except:

		print("[", os.getpid(), "@", ct(), "]", "Failed to terminate; Writing to file")

	# Write Results Out
	with open("results.txt", 'a') as f:
		now = datetime.now()
		f.write("[ " + now.strftime("%H:%M:%S") + "] : " + name + " : " + str(t1-t0) + "\n")
		f.close()

	print("[", os.getpid(), "@", ct(), "]", "Ending")
	driver.close()
	exit()





