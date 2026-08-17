# Registers (or re-registers) the daily Windows Scheduled Task that keeps
# currency exchange rates fresh. Run once by hand:
#   powershell -File scripts\register-currency-fetch-task.ps1
#
# The provider's own data only updates once every 24 hours (confirmed via
# its time_next_update_utc field), so running more often than daily
# wouldn't fetch anything new. 07:00 local (Bangladesh Standard Time,
# UTC+6) is an hour after the provider's ~06:00 local update, as a buffer.
#
# To remove: schtasks /delete /tn "ConvertHub Currency Rate Refresh" /f
# To run once immediately (test): schtasks /run /tn "ConvertHub Currency Rate Refresh"
# To inspect: schtasks /query /tn "ConvertHub Currency Rate Refresh" /v /fo list

schtasks /create `
  /tn "ConvertHub Currency Rate Refresh" `
  /tr "D:\code\convert\scripts\run-currency-fetch.bat" `
  /sc daily `
  /st 07:00 `
  /f
