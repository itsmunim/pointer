/**
 * Created by sankalpo on 7/17/15.
 */
$(document).ready(function () {
    var interaction_pane = $('#interaction-screen');
    var comments_pane = $('.comments-holder');
    var ANNOTATION_PLACEHOLDER_CLASS = 'placeholder-visible';
    var ANNOTATION_PLACEHOLDER_TEXT = 'Type your comments here';
    var TOP_OFFSET = 60;
    var LEFT_BUTTON = 1;
    var ANNOTATION_SIZE_OFFSET = 10;
    var ANNOTATION_COUNT = 0;

    function _getAnnotation (left, top) {
        var ANNOTATION_HTML = '<div class=\"annotation-dot\" id="annotation-dot'+ANNOTATION_COUNT+'"'+ ' style="left:' + left + 'px;' + 'top:' + top + 'px;' + '\">'
            + '<div class="annotation-box" id="annotation-box'+ANNOTATION_COUNT+'"'+'>'
            + '<div class="annotation-input" id="annotation-input'+ANNOTATION_COUNT+'"'+'contenteditable="true"></div>'
            + '<div class="action-pane"></div></div></div>';
        return ANNOTATION_HTML;
    }

    // Annotation input box got focus event
    function _annotationInputLostFocus(annotation_input) {
        if (annotation_input.text() === '') {
            alert('hi');
            annotation_input.addClass(ANNOTATION_PLACEHOLDER_CLASS);
            annotation_input.text(ANNOTATION_PLACEHOLDER_TEXT);
        }
    }

    function _annotationInputGainedFocus(annotation_input) {
        if (annotation_input.text() === ANNOTATION_PLACEHOLDER_TEXT) {
            annotation_input.removeClass(ANNOTATION_PLACEHOLDER_CLASS);
            annotation_input.text('');
        }
    }



    // Interaction pane mouse down event handler
    function _interactionPaneOnMouseDown(event) {
        if (event.which === LEFT_BUTTON) {
            var left = event.pageX - ANNOTATION_SIZE_OFFSET;
            var top = event.pageY - TOP_OFFSET - ANNOTATION_SIZE_OFFSET;
            ANNOTATION_COUNT++;
            interaction_pane.append(_getAnnotation(left, top));
            // Annotation box frame adjustments
            var annotation_box = $('#annotation-box'+ANNOTATION_COUNT);
            var annotation_dot = $('#annotation-dot'+ANNOTATION_COUNT);

            if((left + annotation_dot.outerWidth() + annotation_box.outerWidth()) > interaction_pane.outerWidth()) {
                var ann_box_left = annotation_box.css('left');
                var left_value = parseInt(ann_box_left.substring(0,ann_box_left.indexOf('px')),10);
                left_value -= (annotation_dot.outerWidth() + annotation_box.outerWidth());
                annotation_box.css('left',left_value+'px');
            }
            if((top + annotation_dot.outerHeight() + annotation_box.outerHeight()) > (TOP_OFFSET + interaction_pane.outerHeight())) {
                var ann_box_top = annotation_box.css('top');
                var top_value = parseInt(ann_box_top.substring(0,ann_box_top.indexOf('px')),10);
                top_value -= (annotation_dot.outerHeight() + annotation_box.outerHeight());
                annotation_box.css('top',top_value+'px');
            }
            // Grab the input field
            var annotation_input = $('#annotation-input'+ANNOTATION_COUNT);
            //annotation_input.trigger('focus');// Force focus
            // Set initial placeholders
            annotation_input.addClass(ANNOTATION_PLACEHOLDER_CLASS);
            annotation_input.text(ANNOTATION_PLACEHOLDER_TEXT);
            // Bind events
            annotation_input.on('focusout', _annotationInputLostFocus(annotation_input));
            annotation_input.on('focusin', _annotationInputGainedFocus(annotation_input));
            // IMPORTANT
            annotation_input.on('mousedown', function (event) {
                event.stopPropagation();
            }); // Prevent annotation dot to be drawn on click here

        }
    }

    // Register events
    interaction_pane.on('mousedown', function (event) {
        _interactionPaneOnMouseDown(event);
    });

});