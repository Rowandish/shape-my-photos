<?php
class Parameters
{
	public $valid_parameters, $status_parameters, $status_code;
	private $action, $parameters_array;
	public function __construct($action, $parameters_array)
	{
		$this->valid_parameters = array();
		$this->action = $action;
		$this->parameters_array = $parameters_array;
	}
	public function isValid()
	{
		if (!array_key_exists($this->action, $this->parameters_array))
			return $this->status_code(1);

		$actual_action = $this->parameters_array[$this->action];
		foreach ($actual_action as $key => $value)
		{
			//prendo _GET o _POST
			$type_name = $value["position"];
			$type = $GLOBALS[$type_name];

			if (!isset($type[$key]))
			{
				if (isset($value["not_mandatory"]))
					continue;
				else
					return $this->status_code(2, array($key));
			}

			if (!is_callable($value["callback"]))
				return $this->status_code(3);

			if ($value["callback"]($type[$key], $value["parameters"]) === FALSE)
				return $this->status_code(4, array($key));

			$this->valid_parameters[$key] = $type[$key];
		}
		return $this->status_code(0);
	}
	private function status_code($code, $parameters = array())
	{
		$this->status_code = $code;
		$this->status_parameters = $parameters;
		return $code === 0;
	}
}

	function validateArray($array, $options)
	{
		$default = array("min" => 1, "max" => NULL, "type" => NULL);
		if ($options !== NULL)
			$default = array_replace_recursive($default, $options);

		if (!is_array($array))
			return FALSE;

		if ($default["min"] !== NULL && count($array) < $default["min"])
			return FALSE;
		if ($default["max"] !== NULL && count($array) > $default["max"])
			return FALSE;

		if ($default["type"] !== NULL)
		{
			foreach ($array as $value) {
				if ($default["type"]["callback"]($value, $default["type"]["parameters"]) === FALSE)
					return FALSE;
			}
		}

		return TRUE;
	}

	function validateAll($array, $options)
	{
		return TRUE;
	}

	function validateNumber($number, $options)
	{
		$default = array("min" => null, "max" => null, "type" => "int");
		if ($options !== null)
			$default = array_replace_recursive($default, $options);

		if ($default["type"] === "int" && filter_var($number, FILTER_VALIDATE_INT) === FALSE)
			return FALSE;
		elseif ($default["type"] === "float" && filter_var($number, FILTER_VALIDATE_FLOAT) === FALSE)
			return FALSE;

		if ($default["min"] !== null && $number < $default["min"])
			return FALSE;
		elseif ($default["max"] !== null && $number > $default["max"])
			return FALSE;
		else
			return TRUE;
	}

	function validateString($string, $options)
	{
		$default = array("min" => "1", "max" => "2083", "type" => "standard");
		if ($options !== null)
			$default = array_replace_recursive($default, $options);
		if (!is_string($string))
			return FALSE;
		$return = FALSE;
		$minLength = $default["min"];
		$maxLength = $default["max"];
		if ($minLength!==null && $maxLength!==null)
			$return = (strlen($string) > $minLength && strlen($string)<$maxLength);
		elseif ($maxLength!==null && $minLength===null)
			$return = (strlen($string) < $maxLength);
		elseif ($maxLength===null && $minLength!==null)
			$return = (strlen($string) > $minLength);

		switch ($default["type"]) {
			case 'email':
				$return = $return && filter_var($string, FILTER_VALIDATE_EMAIL);
				break;
			case 'url':
				$return = $return && filter_var($string, FILTER_VALIDATE_URL);
				break;
			case 'regex':
				$return = $return && filter_var($string, FILTER_VALIDATE_REGEXP, array("options" => $default["options"]));
				break;
			case 'standard':
			default:
				$return = $return && $string;
				break;
		}
		return $return;
	}

	function validateBoolean($bool, $options)
	{
		return filter_var($bool, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) !== NULL;
	}

	function validateShape($shape, $options)
	{
		if (validateArray($shape, NULL) === FALSE)
			return FALSE;
		$valid_keys = array("width" => "validateNumber", "height" => "validateNumber", "i" => "validateNumber", "j" => "validateNumber", "size" => "validateNumber", "url" => "validateString");
		$valid_options = array("size" => array("max" => "3"), "url" => array("type" => "url"));
		foreach ($shape as $shape_element)
		{
			if ((validateArray($shape_element, NULL) === FALSE))
				return FALSE;
			foreach ($valid_keys as $key => $value) {
				if (!array_key_exists($key, $shape_element))
					return FALSE;
				if (!$value($shape_element[$key], $valid_options[$key]))
					return FALSE;
			}
		}
		return TRUE;
	}