# how to set up / run (i.e. for development)

    git clone https://github.com/kaukana0/dashboard-migration.git
    cd dashboard-migration/
    git submodule init
    git submodule update
    cd app ; python3 -m http.server 8080

- this gets the sources (dependencies are included as redistributables)
- then, each component is being downloaded as a submodule 
- the app can now be served w/ a http server

# how to deploy

This project doesn't rely on node/npm ecosystem but on GNU bash.
Building a deployment can be done like this:

    ./make-deployment.sh

It creates a deployment in dist/ and starts a python server for manual smoke testing.

TODO: utilize gibhub.com/kaukana0/metaTags

# docu

[Link](./docu/index.md)
