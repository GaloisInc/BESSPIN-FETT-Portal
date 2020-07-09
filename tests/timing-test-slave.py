#!/usr/bin/python3

from testing_module import *

def main():

	print_and_log("command",
					"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
					"Child Started with Arguments: " + str(sys.argv[1:5]))

	# Parse Arguments
	try:
		index = int(sys.argv[1])
		name = sys.argv[2]
		un = sys.argv[3]
		pw = sys.argv[4]
	except:
		print_and_log("error", 
						"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
						"ERROR: Invalid arguments provided to child.")
		write_results("FAILED: invalid arguments")
		exit()

	# Start Webdriver
	try:
		print_and_log("message", 
						"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
						"Starting WebDriver")
		options = webdriver.ChromeOptions()
		options.add_argument("--start-maximized")
		driver = webdriver.Chrome(options=options)
		driver.get("https://fett.securehardware.org/")
	except:
		print_and_log("error", 
						"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
						"ERROR: Child failed to open Webdriver, likely because too many are open")
		write_results("FAILED: could not open WebDriver")
		driver.close()
		exit()

	# Logging In
	try:
		print_and_log("message", 
						"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
						"Started WebDriver, Logging In")

		username = driver.find_element_by_id("username")
		username.clear()
		username.send_keys(un)

		password = driver.find_element_by_id("password")
		password.clear()
		password.send_keys(pw)

		driver.find_element_by_css_selector("button").click()
	except:
		print_and_log("error",
						"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] " ,
						"ERROR: Child failed to log in, likely because of bad credentials: " + str(un) + " " + str(pw))
		write_results("FAILED: logging in failed")
		driver.close()
		exit()

	# Get table
	try:
		print_and_log("message", 
						"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
						"Logged In, Getting Table")
		WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, '//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button')))
		driver.find_element_by_xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button').click()

		# Click launch
		print_and_log("message", 
						"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
						"Launching Instance")
		button = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div/div[2]/div/div/div/div/table/tbody/tr[" + str(index+1) + "]/td[5]/button")))
		button.click()

		# click OK on the time notice dialog
		button = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[2]/div[3]/div[3]/button")))
		button.click()
	except:
		print_and_log("error", 
						"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
						"ERROR: Portal could not load table of launch candidates for user: " + str(un) + " - consider deleting them from accts.txt")
		write_results("FAILED: portal hung on user " + un)
		driver.close()
		exit()

	# Wait for Provisioning to Start
	print_and_log("message",
					"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
					"Instance Launched, Queueing")
	status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text
	while not status == 'provisioning':
		time.sleep(2)
		if status != 'queueing':
			print_and_log("error", 
							"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
							"ERROR: Instance " + str(name) + " using account " + str(un) + " encountered status '" + status + "' as opposed to expected 'queueing'")
			write_results("FAILED: terminated before made it to provisioning during queueing")
			driver.close()
			exit()
		try:
			status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text
		except:
			print_and_log("warning", 
							"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
							"WARNING: Failed to get status once in Queueing")

	# Provisioning Started
	t0 = time.time()
	print_and_log("message", 
					"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
					"First Time Captured at " + str(ct()) + ", Instance Began Provisioning")

	while not status == 'running':
		time.sleep(2)
		if status != 'provisioning':
			print_and_log("error", 
							"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
							"ERROR: Instance " + str(name) + " using account " + str(un) + " encountered status '" + status + "' as opposed to expected 'provisioning'")
			write_results("FAILED: terminated before made it to running during provisioning")
			driver.close()
			exit()
		try:
			status = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"))).text
		except:
			print_and_log("warning", 
							"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
							"WARNING: Failed to get status once in Provisioning")

	# Running
	t1 = time.time()
	print_and_log("message", 
					"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
					"Second Time Captured at " + str(ct()) + ", Instance Started")

	# Try to terminate instance
	try:

		print_and_log("message", 
						"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
						"Terminated Instance, Writing to File")
		WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[6]/button")))
		driver.find_element_by_xpath("//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[6]/button").click()

		WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[3]/div[3]/div[7]/button")))
		driver.find_element_by_xpath("/html/body/div[3]/div[3]/div[7]/button").click()

	except:

		print_and_log("error", 
						"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
						"ERROR: Failed to terminate; Writing to file")

	# Write Results Out
	write_results(str(t1-t0))

	print_and_log("message", 
					"[ " + str(os.getpid()) + " @ " +  str(ct()) +  " ] ",
					"Ending Process.")
	driver.close()
	exit()


if __name__ == "__main__":
	main()


