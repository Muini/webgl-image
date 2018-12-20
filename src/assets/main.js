// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* Loading Global Scss */
import './styles/main.scss'

/* Loading Vendors */
import * as WebFont from 'webfontloader';

import Scroll from './scripts/vendors/scroll';
import InView from './scripts/vendors/in-view';
import Lazyload from './scripts/vendors/lazyload';
import Directive from './scripts/vendors/directive';
import FIP from './scripts/fip';

// Import main scene file
// import './assets/scripts/main';

const scroll = new Scroll({
    inner: document.getElementById('main'),
    smooth: true
});

new Directive({
    name: 'in-view',
    callback: (item, data) => {
        setTimeout(_ => {
            requestAnimationFrame(_ => {
                new InView({
                    elem: item,
                    ratio: (data && data.ratio) ? data.ratio : (1 / 2),
                    classes: (data && data.classes) ? data.classes : false,
                    delay: (data && data.delay) ? data.delay : 0,
                    onUpdate: (data && data.onUpdate) ? data.onUpdate : undefined,
                    onInView: (data && data.onInView) ? data.onInView : undefined,
                    onInViewOnce: (data && data.onInViewOnce) ? data.onInViewOnce : undefined,
                    onOutView: (data && data.onOutView) ? data.onOutView : undefined,
                });
            });
        }, 10);
    }
});

new Directive({
    name: 'lazyload',
    callback: (item, data) => {
        setTimeout(_ => {
            requestAnimationFrame(_ => {
                new Lazyload({
                    elem: item,
                    ratio: (data && data.ratio) ? data.ratio : 1,
                    type: (data && data.type) ? data.type : 'image',
                    url: (data && data.url) ? data.url : '',
                    onLoaded: (data && data.onLoaded) ? data.onLoaded : undefined,
                });
            });
        }, 100);
    }
});

new Directive({
    name: 'fip',
    callback: (item, data) => {
        // console.log('fip url', data.url)
        requestAnimationFrame(_ => {
            new FIP({
                elem: item,
                url: (data && data.url) ? data.url : '',
                scroll: scroll,
            })
        })
    }
})

// Load fonts
WebFont.load({
    google: {
        families: ['Open Sans', 'Quattrocento']
    }
});