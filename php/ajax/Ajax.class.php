<?php
include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/ajax/Parameters.class.php");

class Ajax
{
	protected $output;
	public function __construct($action, $parameters_array)
	{
		$this->output = array();
		$validator = new Parameters($action, $parameters_array);
		if ($validator->isValid())
		{
			$this->$action($validator->valid_parameters);
		}
		else
			$this->error_code($validator->status_code, $validator->status_parameters);
	}
	private function error_code($code, $parameters = array())
	{
		$this->output = array("error" => vsprintf(Ajax::$messages[$code-1], $parameters), "code" => $code);
	}
	public function setOutput($output)
	{
		$this->output = $output;
	}
	public function getOutput()
	{
		return $this->output;
	}
	public static $messages = array("Invalid action", "Mandatory parameter %s missing.", "Internal error: validate function is not callable", "Invalid format for %s parameter.");
}
