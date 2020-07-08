# Timing Tests

## Requirements

- `pip3`
    - `pip3 install selenium --user`
- [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/home) placed in `$PATH`
    - Requires Google Chrome installed too

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
python3 timing-test-driver.py
```

This will call children. These children have a high success rate, but might fail for these known reasons:

- timeout errors (infinite loading spin on launch)
- stale element errors (unknown cause)

