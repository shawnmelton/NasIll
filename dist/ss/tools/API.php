<?php
class API {
    public function __call($name, $args) {
        /* Do nothing.  Let code fall through. */
    }

    public function getCurrentUser() {
        JSON::out(CurrentUser::get()->getInfo());
    }

    public function request($action) {
        $this->$action();
    }
}