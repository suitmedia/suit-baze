
((window, document, undefined) => {

    const Site = {
        enableActiveStateMobile() {
            if ( document.addEventListener ) {
                document.addEventListener('touchstart', () => {}, true)
            }
        },

        WPViewportFix() {
            if ( '-ms-user-select' in document.documentElement.style && navigator.userAgent.match(/IEMobile/) ) {
                let style = document.createElement('style')
                let fix = document.createTextNode('@-ms-viewport{width:auto!important}')

                style.appendChild(fix)
                document.head.appendChild(style)
            }
        },

        objectFitPolyfill() {
            objectFitImages()
        }
    }

    for (let fn in Site) {
        Site[fn]()
    }

    window.Site = Site

    function exist(selector) {
        return new Promise((resolve, reject) => {
            let $elem = $(selector)

            if ( $elem.length ) {
                resolve($elem)
            }

            reject(`no element found for ${selector}`)
        })
    }

    function loadJSON(url) {
        return new Promise((resolve, reject) => {
            fetch(url).then(res => {
                if ( res.ok ) {
                    resolve(res.json())
                } else {
                    reject('Network response not ok')
                }
            }).catch(reject)
        })
    }

})(window, document)
