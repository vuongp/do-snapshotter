# Snapshots as backups
A simple script to make automatic snapshots on Digital Ocean. This does not replace the backup feature of Digital Ocean. However this script has simple options to set your maximum number of snapshots you want to keep and how frequent you want to backup.

## WARNING
Use at your own risk, I'm not responsible!

The script deletes the oldest snapshot if it is more or equal to the number of `maxSnapshots`.

## Setup
There are different solutions for runnning a NodeJs app like this. I personally use pm2.

1. Clone the project
2. Create and copy your token [here](https://cloud.digitalocean.com/settings/api/tokens)
3. Set the token in config.json
4. Edit the config.json to your liking ;)
5. Start `index.js` (example: `pm2 start index.js`)

## Not a Digital Ocean member?
Sign up through my referral link and get 10 dollars free [here](https://m.do.co/c/ad6e12bc4a13). I get 25 dollars when you've spent 25 dollars.

Else just visit https://www.digitalocean.com.
