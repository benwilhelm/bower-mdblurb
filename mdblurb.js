(function($){

	var $edit = $("<a href='#' class='fa fa-edit blurb-control-edit'></a>");
	var $save = $("<a href='#' class='fa fa-save blurb-control-save'></a>");
	var $cancel = $("<a href='#' class='fa fa-close blurb-control-cancel'></a>");
	var $loading = $("<span class='fa fa-circle-o-notch fa-spin'></span>")

	$.fn.addBlurbHandlers = function() {
		var $blurb = $(this);
		$blurb.on('click', '.blurb-control-edit', function(e){
			e.preventDefault();
			$(this).replaceWith($loading);
			$blurb.blurbEditMode();
		});

		$blurb.on('click', '.blurb-control-cancel', function(e){
			e.preventDefault();
			if (confirm("Your changes will be discarded")) {
				$blurb.blurbCancelEdit();
			}
		});

		$blurb.on('click', '.blurb-control-save', function(e){
			e.preventDefault();
			$(this).replaceWith($loading);
			$blurb.blurbSaveEdits();
		});
	}

	$.fn.blurbEditMode = function() {
		var $this = $(this)
		var $controls = $this.find('.blurb-controls').first();
		var $content = $this.find('.blurb-content').first();
		$this.data('blurbContent', $content.html());
		var w = $content.width();
		var h = $content.height();
		var url = '/blurb/' + $this.attr('data-blurb-id');

		$.getJSON(url, function(resp){
			var markdown = resp.blurb.text;
			var $editor = $("<textarea class='blurb-editor'></textarea>")
			$editor.append(markdown || "&nbsp;");
			$editor.width(w);
			$editor.height(h);
			$content.html($editor);
	
			$controls.html('');
			$controls.append($save);
			$controls.append($cancel);

		});
	}

	$.fn.blurbCancelEdit = function() {
		var $this = $(this);
		var $controls = $this.find('.blurb-controls').first();
		var $content = $this.find('.blurb-content').first();
		$content.html($this.data('blurbContent'));
		$controls.html($edit);
	}

	$.fn.blurbSaveEdits = function() {
		var $this = $(this)
		var $controls = $this.find('.blurb-controls').first();
		var $content = $this.find('.blurb-content').first();
		var $editor = $this.find('.blurb-editor').first();
		var url = '/blurb/' + $this.attr('data-blurb-id');
		var markdown = $editor.val();
		console.log(markdown);

		$.ajax( url, {
			type: 'POST',
			data: {text: markdown},
			headers: {
				'X-HTTP-Method-Override': 'PUT'
			},

			success: function(resp) {
				console.log(resp);
				$content.html(resp.blurb.html);
				$controls.html($edit);
			}
		})
	}


	$(document).ready(function(){
		$('*[data-blurb=true]').each(function(idx, obj){
			var $obj = $(obj);
			var $spans = $obj.find('span[data-blurb-id]')
			if ($spans.length) {
				var $span = $spans.first();
				$obj.attr('data-blurb-editable',true);
				var dataId = $span.attr('data-blurb-id');
				$obj.attr('data-blurb-id', dataId);
				$span.remove();

				$obj.wrapInner("<div class='blurb-content'></div>");
				var $controls = $("<div class='blurb-controls'></div>")
				$controls.append($edit);
				$obj.append($controls);

				$obj.addBlurbHandlers();
			}
		})
	})
})(jQuery)