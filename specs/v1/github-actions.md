# PR to staging

- checkout target branch, merge source branch and make sure no errors / conflicts --  (will not push this merged state)
- run all tests 
- smoke test docker build, no push
- if all are successful, approve and merge PR

# PR to main

- checkout target branch, merge source branch and make sure no errors / conflicts --  (will not push this merged state)
- run all tests 
- smoke test docker build, no push
- if all are successful, approve and merge PR

# New merges to main

- create new release
- docker build and push