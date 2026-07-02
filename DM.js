// ================================================
// MUDE APENAS ESTAS DUAS LINHAS
// ================================================
var TELEGRAM_USER = 'BUYHERE508';
var PRODUCT_NAME  = 'ivan';
// ================================================

(function(){
    'use strict';
    var TG=/t\.me|telegram\.me|tg\.me/i;
    var IGNORE=/^(get|get now|get it|click|click here|here|buy|buy now|comprar|join|join now|entrar|telegram|access|acessar|download|view|open|start|começar|subscribe|proceed|continue|yes|sim|👆|➡|→|►|▶|link|button|botão|cta|shop now|add to cart|order now)$/i;

    function build(label){
        var prod=clean(label)||PRODUCT_NAME;
        var msg='👋 Hello!\n💫 I\'m interested in \u201C'+prod+'\u201D\n💰 Could you tell me the price?\n🎁 Any bonuses available?\n💳 What payment methods do you accept?\n🙏 Thank you!';
        var lnk='https://t.me/'+TELEGRAM_USER+'?text='+encodeURIComponent(msg);
        try{
            var c=JSON.parse(localStorage.getItem('tg_clicks')||'[]');
            c.push({ts:new Date().toISOString(),prod:prod,lnk:lnk,pg:location.href});
            localStorage.setItem('tg_clicks',JSON.stringify(c));
        }catch(e){}
        return lnk;
    }

    function clean(t){
        if(!t)return null;
        t=t.trim().replace(/\s+/g,' ');
        if(!t||t.length<3||t.length>120)return null;
        if(IGNORE.test(t))return null;
        return t;
    }

    function fromHref(href){
        if(!href)return null;
        try{
            var m=href.match(/[?&]text=([^&]+)/i);
            if(!m)return null;
            var d=decodeURIComponent(m[1].replace(/\+/g,' '))
                .replace(/^hello[,.]?\s*/i,'')
                .replace(/^i\'?m interested in (purchasing|buying)?\s*/i,'')
                .trim();
            return clean(d);
        }catch{return null;}
    }

    function context(el){
        if(!el||!el.parentElement)return null;
        var node=el;
        for(var d=0;d<8;d++){
            var par=node.parentElement; if(!par)break;
            var hs=par.querySelectorAll('h1,h2,h3,h4,[class*="title"],[class*="heading"],[class*="product"]');
            for(var i=0;i<hs.length;i++){var t=(hs[i].innerText||'').trim().replace(/\s+/g,' ');if(clean(t))return t;}
            var sib=par.previousElementSibling;
            for(var s=0;s<4&&sib;s++,sib=sib.previousElementSibling){
                var sh=sib.querySelector&&sib.querySelector('h1,h2,h3,h4,[class*="title"]');
                if(sh){var st=(sh.innerText||'').trim().replace(/\s+/g,' ');if(clean(st))return st;}
            }
            node=par;
        }
        var pt=document.title.trim().replace(/\s+/g,' ').replace(/\s*[|\-–—].*$/,'').trim();
        return clean(pt)||null;
    }

    function label(el){
        if(!el)return null;
        var dp=el.getAttribute&&el.getAttribute('data-product');
        if(!dp&&el.closest){var p=el.closest('[data-product]');if(p)dp=p.getAttribute('data-product');}
        if(dp&&dp.trim())return dp.trim();
        var ti=(el.getAttribute&&(el.getAttribute('title')||el.getAttribute('aria-label')))||'';
        if(clean(ti))return ti.trim();
        var anc=el.tagName==='A'?el:(el.closest?el.closest('a'):null);
        var rh=anc&&anc.getAttribute('href');
        if(rh&&TG.test(rh)&&rh.indexOf(TELEGRAM_USER+'?text=')===-1){var fh=fromHref(rh);if(fh)return fh;}
        if(anc){var at=(anc.innerText||anc.textContent||'').trim().replace(/\s+/g,' ');if(clean(at))return at;}
        var img=el.querySelector&&el.querySelector('img[alt]');
        if(img&&clean(img.getAttribute('alt')))return img.getAttribute('alt').trim();
        return context(anc||el);
    }

    function replace(){
        // <a href="...t.me...">
        document.querySelectorAll('a[href]').forEach(function(a){
            if(!TG.test(a.getAttribute('href')))return;
            if(!a._dmOrig)a._dmOrig=a.getAttribute('href');
            a.href=build(label(a)); a.target='_blank'; a.rel='noopener noreferrer'; a.removeAttribute('onclick');
        });
        // onclick com t.me
        document.querySelectorAll('[onclick]').forEach(function(el){
            var oc=el.getAttribute('onclick')||''; if(!TG.test(oc))return;
            el.removeAttribute('onclick'); el.style.cursor='pointer';
            (function(cap){el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();window.open(build(label(cap)),'_blank');});})(el);
        });
        // data-href / data-url / data-link
        document.querySelectorAll('[data-href],[data-url],[data-link]').forEach(function(el){
            ['data-href','data-url','data-link'].forEach(function(a){
                var v=el.getAttribute(a); if(v&&TG.test(v))el.setAttribute(a,build(label(el)));
            });
        });
        // Botões com classe telegram / tg
        document.querySelectorAll('[class*="telegram"],[class*="tg-btn"],[class*="tg_btn"]').forEach(function(el){
            if(el._dmBtn)return; el._dmBtn=true; el.style.cursor='pointer';
            el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();window.open(build(label(el)),'_blank');});
        });
    }

    // Captura cliques em links Telegram ainda não substituídos (conteúdo dinâmico)
    document.addEventListener('click',function(e){
        var el=e.target,anc=null;
        for(var i=0;i<8&&el;i++,el=el.parentElement){if(el.tagName==='A'&&TG.test(el.getAttribute('href')||'')){anc=el;break;}}
        if(!anc)return;
        if(anc.href&&anc.href.indexOf('t.me/'+TELEGRAM_USER+'?text=')!==-1)return;
        e.preventDefault();e.stopPropagation();
        if(!anc._dmOrig)anc._dmOrig=anc.getAttribute('href');
        window.open(build(label(anc)),'_blank');
    },true);

    // MutationObserver para conteúdo carregado após DOM pronto
    if(window.MutationObserver){
        new MutationObserver(function(ms){
            if(ms.some(function(m){return m.addedNodes.length>0;}))replace();
        }).observe(document.documentElement,{childList:true,subtree:true});
    }

    function init(){replace();[500,1500,3000,6000].forEach(function(ms){setTimeout(replace,ms);});}
    document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

    window.dmLink=build; window.dmReplace=replace;
    console.log('[DM.js] User:',TELEGRAM_USER,'| Produto:',PRODUCT_NAME);
})();
