<?php
class AlbumCover extends BaseObject {
    private $id;

    public function __construct() {
        parent::__construct();
    }

    public function create($userId) {
        $this->userId = $userId;
        DB::execute('INSERT INTO album_covers SET user_id = (?), cover_date_added = NOW()',
            array('i', $this->userId), false);
        $this->id = DB::getInsertId();
    }

    public static function delete($coverId) {
        $emptyStr = '';
        $id = intval($coverId);
        $stmt = DB::get()->prepare('UPDATE album_covers SET cover_art_photo = ? WHERE cover_id = ?');
        $stmt->bind_param('si', $emptyStr, $id);
        $stmt->execute();
    }

    public function getArtPhoto() {
        return $this->artPhoto;
    }

    public function getArtPhotoUrl() {
        if(preg_match('/\/ss\//', $this->artPhoto)) {
            return substr($this->artPhoto, strpos($this->artPhoto, '/ss/'));
        }
    }

    public function getFileName() {
        return $this->fileName;
    }

    public function getId() {
        return $this->id;
    }

    public function getUploadedPhoto() {
        return $this->uploadedPhoto;
    }

    public function getUploadedPhotoUrl() {
        if(preg_match('/\/ss\//', $this->uploadedPhoto)) {
            return substr($this->uploadedPhoto, strpos($this->uploadedPhoto, '/ss/'));
        }
    }

    public function getUserId() {
        return $this->userId;
    }

    public function load() {
        $result = DB::execute('SELECT * FROM album_covers WHERE cover_id = (?)', array('i', $this->id));
        if(is_array($result)) {
            $this->uploadedPhoto = $result['cover_uploaded_photo'];
            $this->artPhoto = $result['cover_art_photo'];
            $this->fileName = $result['cover_uploaded_file_name'];
            $this->userId = $result['user_id'];
        }
    }

    public function save() {
        DB::execute('
            UPDATE album_covers SET
                cover_uploaded_photo = (?),
                cover_art_photo = (?),
                cover_uploaded_file_name = (?)
            WHERE cover_id = (?)
        ', array('sssi', $this->uploadedPhoto, $this->artPhoto, $this->fileName, $this->id), false);
    }

    public function setArtPhoto($photo) {
        return $this->artPhoto = $photo;
    }

    public function setFileName($name) {
        $this->fileName = $name;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function setUploadedPhoto($photo) {
        return $this->uploadedPhoto = $photo;
    }
}