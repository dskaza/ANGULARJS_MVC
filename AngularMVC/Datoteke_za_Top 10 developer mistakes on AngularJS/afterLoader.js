var afterLoader = (function(){

  var set = {
    list:{} // list of working objects
  }

  // add element path to work list
  set.add = function(n,e){
    set.list[n].path.push(e)
  }

  set.force = function(t){
    t=t||$('[data-after]'),void 0===t.length&&(t=[t]);var a,e=0,r=t.length;for(e;r>e;e+=1)a=t[e],a["LINK"!==a.tagName?"src":"href"]=a.getAttribute("data-after"),a.removeAttribute("data-after");return t
  }

  // parse callback action
  set.parseAction = function(el,name,iterator){
    switch(set.list[name].type){
      case "img":
        setTimeout(function(){
          el.css('opacity',0.0)
            set.force(el)
            el.showElem()
        },set.list[name].delayTime*iterator)
      break
      case "embed":
      setTimeout(function(){
        el.css('opacity',0.0)
          el.attr('src',el.attr('data-after')).attr('style','display:block; opacity:1 !important;')
        },set.list[name].delayTime*iterator)
      break
      case "iframe":
      setTimeout(function(){
        el.css('opacity',0.0)
          el.attr('href',el.attr('data-after')).attr('style','display:block; opacity:1 !important;')
        },set.list[name].delayTime*iterator)
      break
    }
  }

  // create new working instance
  set.create = function(o){
    o = $.extend({
      dom:{
        tag:'.post-item .preview-box > img[data-after]'
      },
      type:'img',
      delayTime:300,
      fn:function(){
        $(set.list[o.name].dom.tag).each(function(i){
          set.parseAction($(this),o.name,i)
        })
      }
    },o)
    set.list[o.name] = o
  }

  set.call = function(n){
    set.list[n].fn()
  }

  return set

})()
