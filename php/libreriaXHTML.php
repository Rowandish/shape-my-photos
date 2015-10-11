<?php
	class HTMLText extends HTMLNode
	{
		public function __construct($text)
		{
			parent::__construct("", $text);
		}
	}
	
	class HTMLNode {
		private $attributes;
		private $children;
		private $type;
		public static $AUTO_CLOSING = array("area", "track", "hr", "br", "link", "img", "base", "col", "command", "embed", "input", "meta", "param", "wbr", "source", "keygen");
		public static $nodeFormatNoChildren = "<%s%s/>\n";
		public static $nodeFormat = "<%s%s>\n%s</%s>\n";
		public static $attrFormat = " %s=\"%s\"";
		
		public function __construct($type, $attributes = array(), $children = array()) {
			if ($type !== "" && count($attributes) != 0 && array_values($attributes) === $attributes) {
				throw new Exception("Attribute parameter should be an associative array.");
			}
			$this->attributes = $attributes;
			$this->type = $type;
			$this->children = $children;
		}
		public function setAttribute($key, $value) {
			if ($this->type === "")
				throw new Exception("Can't set attributes to text.");
			$this->attributes[$key] = $value;
		}
		public function getAttribute($key) {
			return $this->attributes[$key];
		}
		public function removeChild($child) {
			if ($this->type === "")
				throw new Exception("Text can't have children.");
			$exists = array_search($child, $this->children);
			if ($exists !== false)
			unset($this->children[$exists]);
		}
		public function addChildren() {
			if ($this->type === "")
				throw new Exception("Text can't have children.");
			for($i=0,$sum=0;$i<func_num_args();$i++) {
				$this->addChild(func_get_arg($i));
			}
		}
		public function addChild($child) {
			if ($this->type === "")
				throw new Exception("Text can't have children.");
			$this->children[] = $child;
		}
		public function getAllChild() {
			return $this->children;
		}
		public function printHTML() {
			$children = "";
			if ($this->type === "")
				return $this->attributes."\n";
			foreach ($this->children as $c) {
				$children .= $c->printHTML();
			}
			$attributes = "";
			foreach ($this->attributes as $key => $value) {
				$attributes .= sprintf(HTMLNode::$attrFormat, $key, $value);
			}
			if ($children === "" && in_array($this->type, HTMLNode::$AUTO_CLOSING))
				return sprintf(HTMLNode::$nodeFormatNoChildren, $this->type, $attributes);
			else
				return sprintf(HTMLNode::$nodeFormat, $this->type, $attributes, $children, $this->type);
		}
	}
	class XHTML {
		public $body;
		public $html, $head;
		public function __construct($title) {
			$this->html = new HTMLNode("html", array("xmlns:fb" => "http://ogp.me/ns/fb#",  "xml:lang" => "en",  "lang" => "en"));
			$this->head = new HTMLNode("head");
			$this->head->addChild(new HTMLNode("meta", array("http-equiv" => "Content-Type", "content" => "text/html; charset=utf-8")));
			$title_node = new HTMLNode("title");
			$title_node->addChild(new HTMLNode("", $title));
			$this->head->addChild($title_node);
			
			$this->body = new HTMLNode("body");
			
			$this->html->addChildren($this->head, $this->body);
		}
		public function addScript($filename, $content = "") {
			if ($filename == "") {
				$script = new HTMLNode("script", array("type" => "text/javascript"));
				$script->addChild(new HTMLNode("", $content));
				$this->head->addChild($script);
			} else {
				$script = new HTMLNode("script", array("type" => "text/javascript", "src" => $filename));
				$script->addChild(new HTMLNode("", ""));
				$this->head->addChild($script);
			}
		}
		public function addStyle($filename) {
			$style = new HTMLNode("link", array("rel" => "stylesheet", "href" => $filename));
			$this->head->addChild($style);
		}
		public function printHTML() {
			return XHTML::$header . $this->html->printHTML();
		}
		public function __toString() {
			return $this->printHTML();
		}
		private static $header = "<!DOCTYPE html>\n";
		
		public static function createTable($array) {
		/*
			FORMAT:
			array( //tutti i TR
				array( //tutti i TD
					array("value", 1, 1) // content, colspan, rowspan
					array("value", 1, 1) // content, colspan, rowspan
					array("value", 1, 1) // content, colspan, rowspan
					)
				array( //tutti i TD
					array("value", 1, 1) // content, colspan, rowspan
					array("value", 1, 1) // content, colspan, rowspan
					array("value", 1, 1) // content, colspan, rowspan
					)
				);
		*/
			$myTable = new HTMLNode("table");
			foreach ($array as $tr) {
				$myTR = new HTMLNode("tr");
				foreach ($tr as $td) {
					if (count($td) > 3)
						$myTD = new HTMLNode("th");
					else
						$myTD = new HTMLNode("td");
					$myTD->setAttribute("colspan", $td[1]);
					$myTD->setAttribute("rowspan", $td[2]);
					$myTD->addChild(new HTMLNode("", $td[0]));
					$myTR->addChild($myTD);
				}
				$myTable->addChild($myTR);
			}
			return $myTable;
		}
		public static function createComment($text) {
			return new HTMLText("<!-- ".$text." -->");
		}
	}
?>