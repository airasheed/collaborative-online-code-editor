var app;
app = require('derby').createApp(module);

//declare the root route so that when a user visits it, the new snippet is created and the user is redirected to the /:snippetID route
app.get('/', function(page, model, _arg, next) {
    snippetId = model.add('snippets', {
        snippetName: _arg.snippetName,
        code: 'var'
    });

    return page.redirect('/' + snippetId);
});

app.get('/:snippetId', function(page,model,param,next) {
    var snippet = model.at('snippets.' + param.snippetId);
    snippet.subscribe(function(err) {
        if (err) return next(err);
        console.log(snippet.get());
        model.ref('_page.snippet', snippet);
        page.render();
    });
});

app.ready(function(model) {
    editor.setValue(model.get('_page.snippet.code'));

    model.on('change', '_page.snippet.code', function () {
        if (editor.getValue() !== model.get('_page.snippet.code')) {
            process.nextTick(function () {
                editor.setValue(model.get('_page.snipet.code'), 1);
            });
        }
    });

    editor.getSession().on('change', function (e) {
        if(editor.getValue() !== model.get('_page.snippet.code')) {
            process.nextTick(function () {
                model.set('_page.snippet.code', editor.getValue());
            });
        }
    });
});