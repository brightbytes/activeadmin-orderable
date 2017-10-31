(function($) {
  $(document).ready(function() {
    $('.handle').closest('tbody').activeAdminSortable();
  });

  $.fn.activeAdminSortable = function() {
    this.sortable({
      start: function(event, ui) {
        // disable ctrl click triggering
        var $sortable = $(this);
        if (event.ctrlKey) {
          // this is done to address a bug in jQuery.UI
          // we cannot cancel an in-progress sort without exceptions
          setTimeout(function() {
            $sortable.sortable('cancel');
          }, 0);
        }
      },

      update: function(event, ui) {
        var item = ui.item.find('[data-sort-url]');
        var url = item.data('sort-url');
        var actionOnSuccess = item.data('sort-success-action');
        var customParams = {};
        if (typeof item.data('sort-custom-params') === 'object') {
          customParams = item.data('sort-custom-params');
        }

        $.ajax({
          url: url,
          type: 'post',
          data: $.extend(customParams, { position: ui.item.index() + 1 }),
          error: function() { console.error('Saving sortable error'); },
          success: function() {
            if (actionOnSuccess === 'noting') { return; }

            $("tr", $('.handle').closest('tbody')).removeClass('even odd');
            $("tr", $('.handle').closest('tbody')).filter(":even").addClass('odd');
            $("tr", $('.handle').closest('tbody')).filter(":odd").addClass('even');
          }
        });
      }
    });

    this.disableSelection();
  }
})(jQuery);
