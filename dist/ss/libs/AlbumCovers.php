<?php
class AlbumCovers {
    public function convertFileToUrl($file) {
        return preg_match('/\/ss\//', $file) ? substr($file, strpos($file, '/ss/')) : '';
    }

    public function getArt($start, $limit) {
        $art = array();

        $res = DB::execute('
            SELECT cover_art_photo
            FROM album_covers
            WHERE cover_art_photo <> ""
            ORDER BY cover_date_added DESC
            LIMIT ?, ?
        ', array('ii', $start, $limit));

        while($obj = $res->fetch_object()) {
            $art[] = array(
                'url' => $this->convertFileToUrl($obj->cover_art_photo)
            );
        }

        return $art;
    }
}