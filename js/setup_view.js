$(document).ready(function () {
    var interaction_pane = $('#interaction-screen');
    var comments_pane = $('.comments-holder');
    var sticky_header = $('.sticky-header');
    var image_view = $('.image');
    var ANNOTATION_PLACEHOLDER_CLASS = 'placeholder-visible';
    var NO_DISPLAY_CLASS = 'no-display';
    var ANNOTATION_PLACEHOLDER_TEXT = 'Type your comments here';
    var TOP_OFFSET = 60;
    var LEFT_BUTTON = 1;
    var ANNOTATION_SIZE_OFFSET = 12;
    var ANNOTATION_COUNT = 0;

    var annotations = [];

    function _getAnnotationObject(index) {
        return annotations[index];
    }

    // Comment dom
    function _getComment(id, text, time) {
        var comment = '<div class="comment" id="' + id + '"><div class="text">' + text + '</div>' +
            '<div class="date">' + time + '</div>' +
            '</div>';
        return comment;
    }

    // Annotation pin 2 with textarea
    function _getAnnotation2(left, top) {
        var ANNOTATION_HTML = '<div class="annotation-dot" id="annotation-dot' + ANNOTATION_COUNT + '"' + ' style="left:' + left + 'px;' + 'top:' + top + 'px;' + '\">'
            + '<div class="annotation-box" id="annotation-box' + ANNOTATION_COUNT + '"' + '>'
            + '<textarea class="annotation-input" rows="4" cols="50" style="resize:none" id="annotation-input' + ANNOTATION_COUNT + '"></textarea>'
            + '<div class="action-pane">'
            + '<a href="#" id="submit-button' + ANNOTATION_COUNT + '"' + ' class="inline-button positive">Submit</a>'
            + '<a href="#" id="cancel-button' + ANNOTATION_COUNT + '"' + ' class="inline-button negative">Cancel</a>'
            + '</div></div></div>';
        return ANNOTATION_HTML;
    }

    // Annotation Pin : Responsive
    function _getAnnotationP(left, top) {
        var ANNOTATION_HTML = '<div class="annotation-dot" id="annotation-dot' + ANNOTATION_COUNT + '"' + ' style="left:' + left + '%;' + 'top:' + top + '%;' + '\">'
            + '<div class="annotation-box" id="annotation-box' + ANNOTATION_COUNT + '"' + '>'
            + '<div class="annotation-input" id="annotation-input' + ANNOTATION_COUNT + '"' + 'contenteditable="true"></div>'
            + '<div class="action-pane">'
            + '<a href="#" id="submit-button' + ANNOTATION_COUNT + '"' + ' class="inline-button positive">Submit</a>'
            + '<a href="#" id="cancel-button' + ANNOTATION_COUNT + '"' + ' class="inline-button negative">Cancel</a>'
            + '</div></div></div>';
        return ANNOTATION_HTML;
    }

    // Annotation pin
    function _getAnnotation(left, top) {
        var ANNOTATION_HTML = '<div class="annotation-dot" id="annotation-dot' + ANNOTATION_COUNT + '"' + ' style="left:' + left + 'px;' + 'top:' + top + 'px;' + '\">'
            + '<div class="annotation-box" id="annotation-box' + ANNOTATION_COUNT + '"' + '>'
            + '<div class="annotation-input" id="annotation-input' + ANNOTATION_COUNT + '"' + 'contenteditable="true"></div>'
            + '<div class="action-pane">'
            + '<a href="#" id="submit-button' + ANNOTATION_COUNT + '"' + ' class="inline-button positive">Submit</a>'
            + '<a href="#" id="cancel-button' + ANNOTATION_COUNT + '"' + ' class="inline-button negative">Cancel</a>'
            + '</div></div></div>';
        return ANNOTATION_HTML;
    }

    // This is a hacky way to focus contentEditable annotation input
    function _forceFocusOnAnnotationInput (content) {
        var char = 0, sel; // character at which to place caret
        content.focus();
        if (document.selection) {
            sel = document.selection.createRange();
            sel.moveStart('character', char);
            sel.select();
        }
        else {
            sel = window.getSelection();
            sel.collapse(content.firstChild, char);
        }
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

    // Corner case check for annotation placement
    // 2 possible directions- left / top
    function _updateAnnotationBoxPositioning (annotationBox, direction) {
        var rawValue = annotationBox.css(direction);
        var parsedValue = parseInt(rawValue.substring(0, rawValue.indexOf('px')), 10);
        parsedValue -= (parsedValue + (direction === 'left' ? annotationBox.outerWidth() : annotationBox.outerHeight()));
        annotationBox.css(direction, parsedValue + 'px');
    }


    // Interaction pane mouse down event handler
    function _interactionPaneOnMouseDown(event) {
        if (event.which === LEFT_BUTTON) {
            var margin = 15;
            var left = event.pageX - ANNOTATION_SIZE_OFFSET ;
            var top = event.pageY - TOP_OFFSET - ANNOTATION_SIZE_OFFSET ;

            var leftPercentage = Math.abs((left / interaction_pane.outerWidth()) * 100);
            var topPercentage = Math.abs((top / interaction_pane.outerHeight()) * 100);

            ANNOTATION_COUNT++;
            interaction_pane.append(_getAnnotationP(leftPercentage, topPercentage));
            // Annotation box frame adjustments
            var annotation_box = $('#annotation-box' + ANNOTATION_COUNT);
            var annotation_dot = $('#annotation-dot' + ANNOTATION_COUNT);

            if ((left + margin + annotation_dot.outerWidth() + annotation_box.outerWidth()) > interaction_pane.outerWidth()) {
                _updateAnnotationBoxPositioning(annotation_box, 'left');
                //var ann_box_left = annotation_box.css('left');
                //var left_value = parseInt(ann_box_left.substring(0, ann_box_left.indexOf('%')), 10);
                //left_value -= (left_value + annotation_box.outerWidth());
                //annotation_box.css('left', left_value + '%');
            }
            if ((top + margin + annotation_dot.outerHeight() + annotation_box.outerHeight()) > (TOP_OFFSET + interaction_pane.outerHeight())) {
                _updateAnnotationBoxPositioning(annotation_box, 'top');
                //var ann_box_top = annotation_box.css('top');
                //var top_value = parseInt(ann_box_top.substring(0, ann_box_top.indexOf('%')), 10);
                //top_value -= (top_value + annotation_box.outerHeight());
                //annotation_box.css('top', top_value + 'px');
            }
            // Grab the inputs
            var annotation_input = $('#annotation-input' + ANNOTATION_COUNT);
            var submit_button = $('#submit-button' + ANNOTATION_COUNT);
            var cancel_button = $('#cancel-button' + ANNOTATION_COUNT);


            // Set initial placeholders
            annotation_input.addClass(ANNOTATION_PLACEHOLDER_CLASS);
            annotation_input.text(ANNOTATION_PLACEHOLDER_TEXT);
            // Bind events
            annotation_dot.on('mouseenter', function () {
                var id = annotation_dot.attr('id');
                var annotationCount = parseInt(id.substring(id.indexOf('dot') + 'dot'.length, id.length));
                var annObj = _getAnnotationObject(annotationCount - 1);
                // Update the time string for all comments
                if (annObj) {
                    // Already there's an object
                    var comment_count = annObj.replyList.length;
                    for (var i = 0; i < comment_count; i++) {
                        var commentObj = annObj.replyList[i];
                        var timeLabel = $('#annotation-dot-' + annotationCount + '-comment-' + (i + 1)).find('.date')[0];
                        if (timeLabel) console.log(timeLabel.innerText);
                        timeLabel.innerText = getReadableTime(commentObj.time);
                    }
                }
                annotation_box.removeClass(NO_DISPLAY_CLASS);
            });
            annotation_dot.on('mouseleave', function () {
                var annObj = _getAnnotationObject(ANNOTATION_COUNT - 1);
                if (!annObj) {
                    // No annotation object, this should not be on the screen anymore
                    ANNOTATION_COUNT--;
                    annotation_dot.remove();
                } else {
                    annotation_box.addClass(NO_DISPLAY_CLASS);
                }
            });
            cancel_button.on('click', function () {
                var annObj = _getAnnotationObject(ANNOTATION_COUNT - 1);
                if (!annObj) {
                    // Not already created
                    // User cancelled the creation
                    ANNOTATION_COUNT--;
                    annotation_dot.remove();
                } else {
                    annotation_box.addClass(NO_DISPLAY_CLASS);
                }
            });
            submit_button.on('click', function () {
                var id = annotation_dot.attr('id');
                var annotationCount = parseInt(id.substring(id.indexOf('dot') + 'dot'.length, id.length));
                var annObj = _getAnnotationObject(annotationCount - 1);
                if (!annObj) {
                    // Create new object
                    annObj = {
                        id: 'annotation' + ANNOTATION_COUNT,
                        replyList: []
                    };
                    annotations.push(annObj);
                }
                annObj.replyList.push({
                    text: annotation_input.text(),
                    time: Date.now()
                });

                var comment_count = annObj.replyList.length;

                annotation_box.append(_getComment('annotation-dot-' + ANNOTATION_COUNT + '-comment-' + comment_count, annObj.replyList[comment_count - 1].text ,getReadableTime(annObj.replyList[comment_count - 1].time)));
                annotation_input.text('');
                comments_pane.append(_getComment('cb-annotation-dot-' + ANNOTATION_COUNT + '-comment-' + comment_count, annObj.replyList[comment_count - 1].text ,getReadableTime(annObj.replyList[comment_count - 1].time)));
                var commentBoxComment = $('#cb-annotation-dot-' + ANNOTATION_COUNT + '-comment-' + comment_count);
                commentBoxComment.on('click', function () {
                    window.scrollTo(0, top);
                });
            });
            // IMPORTANT
            annotation_dot.on('click', function (event) {
                event.stopPropagation();
            });// Prevent overlapping annotation dots
            annotation_input.on('click', function (event) {
                event.stopPropagation();
            }); // Prevent annotation dot to be drawn on click here

            annotation_input.on('focusout', _annotationInputLostFocus(annotation_input));
            annotation_input.on('focusin', _annotationInputGainedFocus(annotation_input));
            // Force focus
            annotation_input.focus();
            //_forceFocusOnAnnotationInput(annotation_input);


        }
    }

    // Register events
    interaction_pane.on('click', function (event) {
        _interactionPaneOnMouseDown(event);
    });

    // Init
    function _init () {
        var options = {

            // Required. Called when a user selects an item in the Chooser.
            success: function(files) {
                image_view.attr('src',files[0].link);
            },

            // Optional. Called when the user closes the dialog without selecting a file
            // and does not include any parameters.
            cancel: function() {
                alert('You didn\'t select an image! Play with the default image then!');
            },

            // Optional. "preview" (default) is a preview link to the document for sharing,
            // "direct" is an expiring link to download the contents of the file. For more
            // information about link types, see Link types below.
            linkType: "direct", // or "direct"

            // Optional. A value of false (default) limits selection to a single file, while
            // true enables multiple file selection.
            multiselect: false, // or true

            // Optional. This is a list of file extensions. If specified, the user will
            // only be able to select files with these extensions. You may also specify
            // file types, such as "video" or "images" in the list. For more information,
            // see File types below. By default, all extensions are allowed.
            extensions: ['.png', '.jpg', '.jpeg', '.JPG']
        };
        var button = Dropbox.createChooseButton(options);
        sticky_header.append(button);
    }

    _init();

});