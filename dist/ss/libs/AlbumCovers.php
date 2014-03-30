<?php
class AlbumCovers {
    public function convertFileToUrl($file) {
        return preg_match('/\/ss\//', $file) ? substr($file, strpos($file, '/ss/')) : '';
    }

    public function getArt($start, $limit) {
        $art = array();

        $stmt = DB::get()->prepare('
            SELECT cover_art_photo, cover_id
            FROM album_covers
            WHERE cover_art_photo <> ""
            ORDER BY cover_date_added DESC
            LIMIT ?, ?
        ');

        $limitPlus = $limit + 1;
        $stmt->bind_param('ii', $start, $limitPlus);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($photoUrl, $photoId);

        while($stmt->fetch()) {
            $art[] = array(
                'url' => $this->convertFileToUrl($photoUrl),
                'id' => $photoId
            );
        }

        unset($photoUrl);
        unset($photoId);
        $stmt->close();

        return $art;
    }
}