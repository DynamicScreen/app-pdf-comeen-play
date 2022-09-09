<?php

namespace Comeen\PDF\PDF;

use Arr;
use ComeenPlay\SdkPhp\Handlers\SlideHandler;
use ComeenPlay\SdkPhp\Interfaces\ISlide;
use ComeenPlay\SdkPhp\Interfaces\IDisplay;

class PDFHandler extends SlideHandler
{
    public function fetch(ISlide $slide, IDisplay $display): void
    {
        $mediaAccessKey = $this->needed_medias();
        $remoteFileArray = $slide->getOption('remoteFiles', []);

        if (is_array($mediaAccessKey)) {
            $mediaAccessKey = Arr::first($mediaAccessKey);
        }

        $media = Arr::first($slide->getMedia($mediaAccessKey));

        if ($media && Arr::get($media, 'metadata.images')) {
            foreach (Arr::get($media, 'metadata.images') as $img) {
                $this->addSlide([
                    'url' => $img
                ]);
            }
        } else if($remoteFileArray) {
            foreach ($remoteFileArray as $remoteFile) {
                if ($remoteFile) {
                    $urls = Arr::get($remoteFile, 'metadata.images', []);
                    foreach ($urls as $url) {
                        $this->addSlide([
                            'url' => $url
                        ]);
                    }
                }
            }
        }
    }

    public function getValidations($options = null): array
    {
        return [
            'rules' => [
                // 'url' => ['required']
            ],
            'messages' => [
                // 'url.required' => ""
            ],
        ];
    }
}
