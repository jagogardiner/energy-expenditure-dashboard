/*
 * Created Date: Monday, August 7th 2023, 2:02:30 pm
 * Author: Jago Gardiner
 */

$(function () {
    // Hide all help sections, this javascript is a bit messy
    $('#help-2').hide();
    $('#help-3').hide();
    $('#help-4').hide();
    $('#help1-btn').click(function () {
        $('#help-1').fadeIn(500);
        // Hide all other help sections
        $('#help-2').hide();
        $('#help-3').hide();
        $('#help-4').hide();
        // Show this help section
    });
    $('#help2-btn').click(function () {
        $('#help-2').fadeIn(500);
        // Hide all other help sections
        $('#help-1').hide();
        $('#help-3').hide();
        $('#help-4').hide();
        // Show this help section
    });
    $('#help3-btn').click(function () {
        $('#help-3').fadeIn(500);
        // Hide all other help sections
        $('#help-1').hide();
        $('#help-2').hide();
        $('#help-4').hide();
        // Show this help section
    });
    $('#help4-btn').click(function () {
        $('#help-4').fadeIn(500);
        // Hide all other help sections
        $('#help-1').hide();
        $('#help-2').hide();
        $('#help-3').hide();
        // Show this help section
    });
});
