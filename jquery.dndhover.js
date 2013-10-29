/*

I don't know where this was originally sourced, but I've 
made some slight tweaks. Drop events will now reset the 
collection so the dndHoverStart event fires as expected
for subsequent dragenter events following a drop event.
I've also removed calls to size() (deprecated).
jeff@phrough.com

IMPLEMENTATION EXAMPLE
===============================

$('#target').dndhover().on({
    'dndHoverStart': function(e) {
        $container.addClass('dragenter');
        e.stopPropagation();
        e.preventDefault();
        return false;
    },
    'dndHoverEnd': function(e) {
        $container.removeClass('dragenter');
        e.stopPropagation();
        e.preventDefault();
        return false;
    },
    'drop': function(e) {
        $container.removeClass('dragenter');
    }
});

*/
$j.fn.dndhover = function(options) {
    return this.each(function() {
        var self = $j(this);
        var collection = $j();
        self.on('dragenter', function(event) {
            if (collection.length === 0) {
                self.trigger('dndHoverStart');
            }
            collection = collection.add(event.target);
        });
        self.on('dragleave', function(event) {
            /*
             * Firefox 3.6 fires the dragleave event on the previous element
             * before firing dragenter on the next one so we introduce a delay
             */
            setTimeout(function() {
                collection = collection.not(event.target);
                if (collection.length === 0) {
                    self.trigger('dndHoverEnd');
                }
            }, 1);
        });
        self.on('drop', function() {
            // reset the collection on drop, as dragleave won't be fired.
            collection = $j();
        });
    });
};