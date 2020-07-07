from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import time
import sys
import os

if __name__ == "__main__":

	print("[", os.getpid(), "]", ":", sys.argv[1:5])

	# name i name un pw

	index = int(sys.argv[1])
	name = sys.argv[2]

	driver = webdriver.Chrome()
	driver.get("https://fett.securehardware.org/")

	print("[", os.getpid(), "]", "Started WebDriver, Logging In")

	username = driver.find_element_by_id("username")
	username.clear()
	username.send_keys(sys.argv[3])

	password = driver.find_element_by_id("password")
	password.clear()
	password.send_keys(sys.argv[4])

	driver.find_element_by_css_selector("button").click()

	print("[", os.getpid(), "]", "Getting Table, Launching Instance")
	# Get table

	WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, '//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button')))
	driver.find_element_by_xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button').click()

	# click launch
	button = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div/div[2]/div/div/div/div/table/tbody/tr[" + str(index+1) + "]/td[5]/button")))
	button.click()

	# click OK on the time notice dialog
	button = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[2]/div[3]/div[3]/button")))
	button.click()

	print("[", os.getpid(), "]", "Waiting for provisioning")

	# wait for provisioning
	status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text

	while not status == 'provisioning':
		time.sleep(2)
		assert(status == 'queueing')
		status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text
		#print(status)

	print("[", os.getpid(), "]", "Provisioning Started")

	t0 = time.time()

	while not status == 'running':
		time.sleep(2)
		assert(status == 'provisioning')
		status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text
		#print(status)

	t1 = time.time()

	print("[", os.getpid(), "]", "Time Captured, Instance Started")

	# /html/body/div[3]/div[3]/div[7]/button
	WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[6]/button")))
	driver.find_element_by_xpath("//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[6]/button").click()
	
	WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[3]/div[3]/div[7]/button")))
	driver.find_element_by_xpath("/html/body/div[3]/div[3]/div[7]/button").click()

	print("[", os.getpid(), "]", "Terminated Instance, Writing to File")

	with open("results.txt", 'a') as f:
		f.write(name + " : " + str(time))
		f.close()

	print("[", os.getpid(), "]", "Ending")

	exit()





