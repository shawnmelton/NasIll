<?php
/*!
 * @desc Render a view template.
 * @author Shawn Melton <shawn.melton@webteks.com>
 * @verison $id: $
 */
class Template extends BaseObject {
    public function render($file) {
        ob_start();
        require_once dirname(dirname(__FILE__)) .'/templates/'. $file .'.phtml';
        return ob_get_clean();  
    }
}