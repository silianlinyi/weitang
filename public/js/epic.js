var opts = {
    container: 'epiceditor',
    textarea: null,
    basePath: 'epiceditor',
    clientSideStorage: true,
    localStorageName: 'epiceditor',
    useNativeFullscreen: false,
    parser: marked,
    file: {
        name: 'epiceditor',
        defaultContent: '# This is a blog post.',
        autoSave: 100
    },
    theme: {
        base: '/themes/base/epiceditor.css',
        preview: '/themes/preview/github.css',
        editor: '/themes/editor/epic-dark.css'
    },
    button: {
        preview: true,
        fullscreen: true,
        bar: "show"
    },
    focusOnLoad: true,
    shortcut: {
        modifier: 18,
        fullscreen: 70,
        preview: 80
    },
    string: {
        togglePreview: '切换到预览模式',
        toggleEdit: '切换到编辑模式',
        toggleFullscreen: '全屏'
    },
    autogrow: {
        minHeight: 280,
        maxHeight: 700,
        scroll: true
    }
}
var editor = new EpicEditor(opts).load(function() {
    console.log('Editor loaded...');
});