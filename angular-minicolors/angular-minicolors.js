
var refocusing = false

function keepWithin(value, min, max) {
  if( value < min ) value = min
  if( value > max ) value = max
  return value
}

var convertCase = function(hex, lowercase){
  if (lowercase) return hex.toLowerCase()
  return hex.toUpperCase()
}

var cleanCSS = function(css){
  return css.replace(/[^\d:]/g, '')
}

// color transformation functions sourced from jQuery Minicolors https://github.com/claviska/jquery-minicolors

// Converts an HSB object to an RGB object
function hsb2rgb(hsb) {
  var rgb = {}
  var h = Math.round(hsb.h)
  var s = Math.round(hsb.s * 255 / 100)
  var v = Math.round(hsb.b * 255 / 100)
  if(s === 0) {
    rgb.r = rgb.g = rgb.b = v
  } else {
    var t1 = v
    var t2 = (255 - s) * v / 255
    var t3 = (t1 - t2) * (h % 60) / 60
    if( h === 360 ) h = 0
    if( h < 60 ) rgb = {r: t1, b: t2, g: t2 + t3, }
    else if( h < 120 ) rgb = {g: t1, b: t2, r: t1 - t3, }
    else if( h < 180 ) rgb = {g: t1, r: t2, b: t2 + t3, }
    else if( h < 240 ) rgb = {b: t1, r: t2, g: t1 - t3, }
    else if( h < 300 ) rgb = {b: t1, g: t2, r: t2 + t3, }
    else if( h < 360 ) rgb = {r: t1, g: t2, b: t1 - t3, }
    else rgb = { r: 0, g: 0, b: 0, }
  }
  return {
    r: Math.round(rgb.r),
    g: Math.round(rgb.g),
    b: Math.round(rgb.b)
  };
}

// Converts an RGB object to a hex string
function rgb2hex(rgb) {
  var hex = [
    rgb.r.toString(16),
    rgb.g.toString(16),
    rgb.b.toString(16)
  ]
  $.each(hex, function(nr, val) {
    if (val.length === 1) hex[nr] = '0' + val
  })
  return '#' + hex.join('');
}

// Converts an HSB object to a hex string
function hsb2hex(hsb) {
  return rgb2hex(hsb2rgb(hsb))
}

// Converts a hex string to an HSB object
function hex2hsb(hex) {
  var hsb = rgb2hsb(hex2rgb(hex))
  if( hsb.s === 0 ) hsb.h = 360
  return hsb
}

// Converts an RGB object to an HSB object
function rgb2hsb(rgb) {
  var hsb = { h: 0, s: 0, b: 0 }
  var min = Math.min(rgb.r, rgb.g, rgb.b)
  var max = Math.max(rgb.r, rgb.g, rgb.b)
  var delta = max - min
  hsb.b = max
  hsb.s = max !== 0 ? 255 * delta / max : 0
  if( hsb.s !== 0 ) {
    if( rgb.r === max ) {
      hsb.h = (rgb.g - rgb.b) / delta
    } else if( rgb.g === max ) {
      hsb.h = 2 + (rgb.b - rgb.r) / delta
    } else {
      hsb.h = 4 + (rgb.r - rgb.g) / delta
    }
  } else {
    hsb.h = -1
  }
  hsb.h *= 60
  if( hsb.h < 0 ) {
    hsb.h += 360
  }
  hsb.s *= 100/255
  hsb.b *= 100/255
  return hsb
}

// Converts a hex string to an RGB object
function hex2rgb(hex) {
  hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16)
  return {
    r: hex >> 16,
    g: (hex & 0x00FF00) >> 8,
    b: (hex & 0x0000FF)
  }
}

function calcHSB(hue, saturation, brightness){
  h = keepWithin(360 - Math.floor(hue * (360 / 150)), 0, 360)
  s = keepWithin(Math.floor(saturation * (100 / 150)), 0, 100)
  b = keepWithin(100 - Math.floor(brightness * (100 / 150)), 0, 100)
  return {h: h, s: s, b: b}
}

angular.module('sport.ng')

  .directive('minicolors', function(MinicolorsService, _) {
    return {
      restrict: 'EA',
      scope: {
        color: '='
      },
      templateUrl: '/bower_components/sport-ng/angular-minicolors/input.html',
      link: function(scope, element, attrs) {

        defaults = {
          maxlength: 7,
          autocomplete: false,
          lowercase: true,
          defaultColor: '#ffffff',
          expand: true
        }

        // copy the options we care about
        var options = _.extend({}, defaults, _.omit(attrs, ['$$element', '$attr']))

        // setup input attributes
        var attrOpts = _.pick(options, ['maxlength', 'autocomplete'])
        for (var opt in attrOpts) {
          element.find('input').attr(opt, attrOpts[opt])
        }

        if (attrs['class']) element.find('span').addClass(attrs['class'].replace(/ng-[^\s]+/g, ''))

        var showColor = scope.color ? convertCase(scope.color, options.lowercase) : convertCase('#ffffff', options.lowercase)

        var updateColor = function(newColor) {
          if (newColor){
            newColor = convertCase(newColor, options.lowercase)
            if (newColor !== scope.color) scope.color = newColor
            showColor = newColor
            element.find('a').css('background-color', newColor)
          }
        }

        scope.show = function() {
          if (!refocusing) MinicolorsService.show(element, showColor, scope.setColor, _.pick(options, ['lowercase', 'defaultColor', 'expand']))
        }

        scope.tryHide = function() { MinicolorsService.tryHide() }

        scope.setColor = function(newColor) { updateColor(newColor) }

        scope.$watch('color', function(newColor) {
          updateColor(newColor)
        })

        updateColor(showColor)
        
      }
    }
  })

  .factory('MinicolorsService', function(_){
    var picker = {
      show: function(element, color, callback, opts) {
        if (element === picker.element) return
        currentCallback = callback
        picker.element = element
        picker.color = color
        _.extend(picker, opts)
      },
      hide: function() {
        picker.element = null
        picker.color = null
      },
      tryHide: function() {
        picker.wantsToHide = true
      },
      set: function(color) {
        if (color && typeof currentCallback == 'function')
          currentCallback(color)
      },
      parseHex: function(string){
        string = string.replace(/[^a-f0-9]/ig, '')
        if ((string.length !== 3 && string.length !== 6) || !string) return picker.defaultColor
        if (string.length === 3 && picker.expand) {
          string = string[0] + string[0] + string[1] + string[1] + string[2] + string[2]
        }
        return '#' + convertCase(string, picker.lowercase)
      }
    }
    return picker
  })

  .directive('minicolorsPicker', function(MinicolorsService){
    return {
      restrict: 'EA',
      templateUrl: '/bower_components/sport-ng/angular-minicolors/picker.html',
      link: function(scope, element, attrs) {

        var slider, clicking = false, inputFocus = false

        function init(){
          scope.color = MinicolorsService.color
          scope.hsb = hex2hsb(MinicolorsService.color)
          setDisplay()
        }

        function setDisplay(){
          var x = keepWithin(Math.ceil(scope.hsb.s / (100 / 150)), 0, 150)
          var y = keepWithin(150 - Math.ceil(scope.hsb.b / (100 / 150)), 0, 150)
          element.find('.minicolors-colorpicker').css({
            top: y + 'px',
            left: x + 'px'
          })

          // Set slider position
          y = keepWithin(150 - Math.ceil((scope.hsb.h / (360 / 150))), 0, 150)
          element.find('.minicolors-huepicker').css('top', y + 'px')
          element.find('.minicolors-grid').css('background-color', hsb2hex({ h: scope.hsb.h, s: 100, b: 100 }))
        }

        function refocus() {
          setTimeout(function() {
            if (MinicolorsService.element) {
              refocusing = true
              if (!inputFocus) MinicolorsService.element.find('a').focus()
              refocusing = false
            }
          }, 1)
        }

        element.on('mousedown', function() { clicking = true; refocus() })
        element.on('mouseup', function() { clicking = false })

        $(document).on('mousedown', '.minicolors-grid, .minicolors-hues', function(e){
          slider = $(e.currentTarget)
          move(slider, e, true)
        })

        $(document).on('mousemove', function(e){
          if (slider) move(slider, e)
        })

        $(document).on('mouseup', function(){
          slider = null
          clicking = false
        })

        scope.tryHide = function() {
          inputFocus = false
          scope.color = MinicolorsService.parseHex(scope.color)
          MinicolorsService.tryHide()
        }

        scope.giveFocus = function() { inputFocus = true }

        scope.inputColor = function() {
          scope.hsb = hex2hsb(MinicolorsService.parseHex(scope.color, true))
          setDisplay(scope.hsb)
        }

        scope.$watch(
          function() { return MinicolorsService.wantsToHide },
          function(wantsToHide, oldVal) {
            if (wantsToHide) {
              MinicolorsService.wantsToHide = false
              if (!clicking) MinicolorsService.hide()
            }
        })

        scope.$watch('hsb.h', function(newHue) {
          element.find('.minicolors-grid').css('background-color', hsb2hex({ h: newHue, s: 100, b: 100 }))
        })

        scope.$watch('color', function(newColor) {
          if (newColor) MinicolorsService.set(newColor)
        })

        var tetherRef
        scope.$watch(
          function() { return MinicolorsService.element },
          function(target, oldVal) {
            if (!target) return scope.showing = false
            if (tetherRef) tetherRef.destroy()
            init()
            scope.showing = true
            setTimeout(function() {
              tetherRef = new Tether({
                element: element[0],
                target: target[0],
                attachment: 'bottom left',
                targetAttachment: 'top left',
                offset: '10px 0',
                constraints: [{ to: 'scrollParent', attachment: 'together' }]
              })
            }, 1)

          })

        function move(slider, event, animate) {
          var settings = {animationEasing: 'swing', animationSpeed: 50}
          var picker = $(slider.children()[0])
          var offsetX = slider.offset().left, offsetY = slider.offset().top
          var x = Math.round(event.pageX - offsetX), y = Math.round(event.pageY - offsetY)
          var duration = animate ? settings.animationSpeed : 0
          var wx, wy, r, phi

          // Touch support
          //copied from the original code, no idea if it works
          if (event.originalEvent.changedTouches) {
            x = event.originalEvent.changedTouches[0].pageX - offsetX
            y = event.originalEvent.changedTouches[0].pageY - offsetY
          }

          // Constrain picker to its container
          if (x < 0) x = 0
          if (y < 0) y = 0
          if (x > slider.width()) x = slider.width()
          if (y > slider.height()) y = slider.height()

          // Move the picker
          if (slider.is('.minicolors-grid')) {
            picker
            .stop(true)
            .animate({
              top: y + 'px',
              left: x + 'px'
            }, duration, settings.animationEasing, function() { })

            scope.$apply(function read() {
              scope.hsb = calcHSB(cleanCSS(element.find('.minicolors-huepicker').css('top')), x, y)
            })
          } else {
            picker
            .stop(true)
            .animate({
              top: y + 'px'
            }, duration, settings.animationEasing, function() { })

            scope.$apply(function read() {
              scope.hsb = calcHSB(y, cleanCSS(element.find('.minicolors-colorpicker').css('left')), cleanCSS(element.find('.minicolors-colorpicker').css('top')))
            })
          }
          scope.color = hsb2hex(scope.hsb)

        }

      }
    }

  })
