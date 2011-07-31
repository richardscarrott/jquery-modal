## Quick start
	
### JavaScript:

    $.modal('This is some content');
	
### generated mark-up

    <div class="modal-overlay"></div>
   
    <div class="modal">
        <div class="modal-content">
            
            <!-- content -->
            
        </div>
        <span class="modal-close">close X</span>
    </div>

## DOCS

### Overview
This was written to address some issues I've experienced with a few popular modal scripts I've used in the past.

It resolves the following problems:

1. Dynamically sizes the modal based on it's final state, so any styles applied based on .modal * (or .'extraClasses' *) will be taken into account and the modal correctly sized.
2. Avoids the use of fixed positioning to ensure that users can always get to the content, even if it's out of the viewport.
3. Allows extra classes to be added to the container element (not just the content element) to easily change and extend different designs / 'skins'.

### Options

#### width: 'auto' (string, number)
Defines the width of the modal, if set to 'auto' the width will be automatically calculated based on size of content

#### height: 'auto' (string, number)
Defines the height of the modal, if set to 'auto' the height will be automatically calculated based on size of content

#### maxWidth: 600 (number)
Defines the maxium width of the modal

#### maxHeight: 600 (number)
Defines the maxium height of the modal

#### fitViewport: true (boolean)
If set to true the modal will be sized to fit within the viewport

#### keepAspect: false (boolean)
If set to true the modal will maintain it's original aspect ratio if / when resized
 
#### modal: true (boolean)
If set to true the page will blocked with an overlay div to stop interaction

#### transitionSpeed: 200 (string, number)
Defines speed modal will fadein. Can take any standard jQuery speed strings or number

#### closeText: 'close X' (string)
Defines text to be applied to close element

#### extraClasses: null (string)
Defines any extra space seperated classes to be added to the outer .modal element

#### appendTo: 'body' (string, element, jQuery object)
Both modal and overlay are appended to this element

#### position: null (array - [top, left])
Allows final modal position to be overridden if centering is not desired

#### closeSelector: '.modal-content-close' (string)
Any elements wihtin the modal matching the closeSelector will close the modal on click

#### closeKeyCode: 27 (number)
Keycode used to close the modal, default to Esc key

#### closeOverlay: true (boolean)
Defines whether clicking on the overlay will close the modal

#### overlayOpacity: 0.5 (number)
Defines the overlay opacity; it's within JS and not CSS to a) take advantage of jQuery's cross browser opacity normalisation and b) because <= IE7 can't fadeIn translucent elements

### Callbacks

#### The following data is passed to all callbacks
    
    {
        modal (jQuery object)
        content (jQuery object)
        closeBtn (jQuery object)
        overlay (jQuery object)
    }

#### init: null (function)
See tin

#### beforeOpen: null (function)
See tin

#### afterOpen: null (function)
See tin

#### beforeClose: null (function)
See tin

#### afterClose: null (function)
See tin

### Methods
#### modal $.modal(content, [options])
Displays content in modal using options, content can be a selector, element, HTML string, or jQuery object (anything $.fn.append() can take)

#### refresh $.modal.refresh()
repositions modal, useful if content has changed

#### update $.modal.update(newContent, [options])
Replaces modal content with newContent, unlike $.modal(), options persist

#### loading $.modal.loading([beforeClose])
Helper method to show modal in a loading state, use .modal-isloading for styling.
A function can be passed in to be called before close; this can be useful if ajax request needs to be aborted

#### close $.modal.close([animate])
Closes modal, pass in boolean to define whether close should fade out

#### destroy $.modal.destroy()
Removes modal from DOM and unbinds all associated events

[If you have any questions or ideas you can contact me here](http://richardscarrott.co.uk/contact "Richard Scarrott")