# Timing Tests

## Requirements

- `pip3`
- [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/home) placed in `$PATH`
    - Requires Google Chrome installed too

Once these are installed, run

```bash
./install_requirements.sh
```
    
## Accounts

Compose the file `accts.txt` with structure: 

```
...
"username","password"
"username","password"
...
```

This should be the same as csv layout, with the headings removed. This cannot be used twice currently

## Driver Functioning

```bash
./timing-test-driver.py [-h] [RUNS] [TIME_BETWEEN_INSTANCES]
```

This will call `RUNS * LAUNCH_CANDIDATES` children at `TIME_BETWEEN_INSTANCES` intervals. These might fail for these known reasons:

- timeout errors (infinite loading spin on launch - a documented FETT Portal error)
- password passing errors (because of invalid login creds recieved by child)

You might see warnings related to:

- failed to get status once in STATUS

This is of unknown cause, but seems to be related to overall system load (higher load -> higher instance of these warnings). These do not affect functionality. This is only concerning when the same PID prints out one of these warnings every 2 seconds (the polling interval) - this means that the webdriver for that instance has crashed (unlikely) or been killed (more likely).

## Slave Functioning

```bash
./timing-test-slave.py [-h] index name username password
```

This is to be used standalone when one individual target needs tested.

## Killing 

To kill this program mid-execution (not recommended):

```bash
pkill -f slave.py && pkill -f driver.py
```
