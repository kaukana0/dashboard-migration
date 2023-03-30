# how to run

    git clone https://github.com/kaukana0/dashboard-migration.git
    cd dashboard-migration/
    git submodule init
    git submodule update
    cd app ; python3 -m http.server 8080

- this gets the sources (dependencies are included as redistributables)
- then, each component is being downloaded as a submodule 
- the app can now be served w/ a http server

# how to deploy

TBD

# docu

[Link](./docu/index.md)
