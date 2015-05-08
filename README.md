# hapi-dash
A terminal dashboard for hapi

## Usage:

Install the package into your node project
```
    npm install --save hapi-dash
```

Register the plugin with the Hapi server

```
server.register({register: require('hapi-dash')}, function (err) {
    if (err) {
        console.error('Failed to load plugin:', err);
    }
});
```