<?php
class AlbumCovers {
    public function convertFileToUrl($file) {
        return preg_match('/\/ss\//', $file) ? substr($file, strpos($file, '/ss/')) : '';
    }

    public function getArt($start, $limit) {
        $art = array();

        $stmt = DB::get()->prepare('
            SELECT cover_art_photo
            FROM album_covers
            WHERE cover_art_photo <> ""
            ORDER BY cover_date_added DESC
            LIMIT ?, ?
        ');

        $stmt->bind_param('ii', $start, $limit);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($photo);
        
        while($stmt->fetch()) {
            $art[] = array(
                'url' => $this->convertFileToUrl($photo)
            );
        }

        unset($photo);
        $stmt->close();

        return $art;
    }
}