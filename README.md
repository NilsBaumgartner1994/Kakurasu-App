#KitchenBase

## Setup

- Pull submodules: ```git submodule update --init --recursive```

### Native Mobile App

In order to use the login system with SSO, we need to configure the deep linking.
- Deeplinking: https://reactnavigation.org/docs/deep-linking/
- Level ios: ```npx uri-scheme add myapp --ios```
- Level android: ```npx uri-scheme add myapp --android```
