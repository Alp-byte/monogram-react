<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Svgmaster extends CI_Controller {

	public function __construct()
    {
        parent::__construct();
        $this->load->helper('url');
    }

    /**
     * Convert uploaded svg file to eps file
     * Eps file name is same as svg file name.
     *
     * @param 	none
     * @return 	json code
     *
     */
	public function svgToEps() {
		/* Upload requested file and get result */
		$uploadResult = $this->do_upload();

		/* if file upload success */
		if ($uploadResult) {
			/* load custom library which handles svg file conversion */
			$this->load->library('inkscape');

			$this->inkscape->setFile($uploadResult['full_path']);
			$this->inkscape->exportAreaSnap(); //better pixel art
			$this->inkscape->exportTextToPath();

			try {
				$targetFilepath = $uploadResult['file_path'] . $uploadResult['raw_name'];
				/* set target file type as EPS. if success, return converted eps file url */
			    if ($this->inkscape->export('eps', $targetFilepath)) {
			    	echo json_encode(array('url' => base_url('uploads/') . $uploadResult['raw_name'] . '.eps'));
			    	return;
			    }
			} catch (Exception $exc) {
				show_error($exc->getMessage(), 400, $heading = 'An Error Was Encountered');
			}

			/* if conversion fails, return empty url */
			echo json_encode(array('url' => ''));
		}
	}

    /**
     * Convert uploaded svg file to dxf file
     * Dxf file name is same as svg file name.
     *
     * @param 	none
     * @return 	json code
     *
     */
	public function svgToDxf() {
		/* Upload requested file and get result */
		$uploadResult = $this->do_upload();

		/* if file upload success */
		if ($uploadResult) {
			/* load custom library which handles svg file conversion */
			$this->load->library('inkscape');

			$this->inkscape->setFile($uploadResult['full_path']);
			$this->inkscape->exportAreaSnap(); //better pixel art
			$this->inkscape->exportTextToPath();

			try {
				$targetFilepath = $uploadResult['file_path'] . $uploadResult['raw_name'];
				/* set target file type as DXF. if success, return converted dxf file url */
			    if ($this->inkscape->export('dxf', $targetFilepath)) {
			    	echo json_encode(array('url' => base_url('uploads/') . $uploadResult['raw_name'] . '.dxf'));
			    	return;
			    }
			} catch (Exception $exc) {
				show_error($exc->getMessage(), 400, $heading = 'An Error Was Encountered');
			}

			/* if conversion fails, return empty url */
			echo json_encode(array('url' => ''));
		}
	}

    /**
     * Upload requested file to server
     * Available formats: svg
     * Upload path: /uploads
     *
     * @param 	none
     * @return 	array
     *
     */
    public function do_upload()
    {
    	/* Set upload config */
        $config['upload_path']          = './uploads/';
        $config['allowed_types']        = 'svg';

        /* Load CI library which handles file upload */
        $this->load->library('upload', $config);

		/* Requested file name : file */
        if ( ! $this->upload->do_upload('file')) {
        	show_error($this->upload->display_errors(), 400, $heading = 'An Error Was Encountered');
        	return false;
        } else {
            return $this->upload->data();
        }
    }
}
