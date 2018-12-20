import InView from './in-view';

export default class LazyLoad extends InView {

    constructor(opt) {

        super(opt);

        this.onLoaded = opt.onLoaded || undefined;
        this.type = opt.type || 'image';
        this.url = opt.url || '';

        this.hasLoaded = false;

        this.initializeDom();

        //By setting OnInViewOnce, it will load automaticly
        if (this.elem && this.elem.inViewOnce) {
            this.load();
        } else {
            this.onInViewOnce = _ => {
                this.load();
            };
        }

        this.check();
    };

    initializeDom() {
        this.container = this.elem.el.parentNode;
        if (!this.container) return;
        requestAnimationFrame(_ => {
            this.container.classList.add('lazyload')
        });
    }

    check() {
        if (this.hasLoaded) return;

        super.check();
    };

    replaceElementByImage(element, img) {
        if (!element.parentNode) return false
        return element.parentNode.replaceChild(img, element)
    };

    load() {
        if (this.hasLoaded) return;
        this.hasLoaded = true;

        requestAnimationFrame(_ => {
            this.container.classList.add('lazyloading');
        });

        let img = new Image();
        //Onload job
        img.onload = _ => {
                if (this.isDestroyed) return;
                requestAnimationFrame(_ => {
                    this.container.classList.remove('lazyloading');
                    if (this.type === 'image') {
                        this.container.appendChild(img);
                    } else if (this.type === 'background') {
                        let newBG = this.elem.el.cloneNode();
                        newBG.style['backgroundImage'] = 'url( ' + this.url + ' )';
                        this.container.appendChild(newBG);
                    }
                    if (this.onLoaded && typeof this.onLoaded === 'function') {
                        this.onLoaded.call()
                    }
                    requestAnimationFrame(_ => {
                        this.container.classList.add('lazyloaded');
                    });
                });
            }
            //Handle errors
        img.onerror = (error) => {
                if (this.onLoaded && typeof this.onLoaded === 'function') {
                    this.onLoaded.call()
                }
                throw 'Lazy load Error on elem ' + this.elem.el + 'w/ path : ' + error.path[0].currentSrc
            }
            //Set src
        img.src = this.url;

    };

}