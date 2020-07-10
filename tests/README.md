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

## Functioning

```bash
./timing-test-driver.py [RUNS] [TIME_BETWEEN_INSTANCES]
```

This will call `RUNS * TARGETS` children at `TIME_BETWEEN_INSTANCES` intervals. These might fail for these known reasons:

- timeout errors (infinite loading spin on launch - a documented FETT Portal error)
- password passing errors (because of invalid login creds recieved by child)

To kill this program mid-execution (not recommended):

```bash
pkill -f slave.py && pkill -f driver.py
```
