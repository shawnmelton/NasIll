<?php
class API {
    public function __call($name, $args) {
        /* Do nothing.  Let code fall through. */
    }

    public function generateAlbumArt() {
        $form = new PhotoEditForm();
        $form->process();
    }

    public function request($action) {
        $this->$action();
    }

    public function saveAccountInfo() {
        $form = new AccountForm();
        $form->process();
    }
}