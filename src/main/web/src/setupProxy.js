module.exports = function (app) {
    app.get('/favicon.ico', (req, res) => {
        res.status(204).end();
    });
};

