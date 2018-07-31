<?php
class SelectOption implements JsonSerializable {
    private $value;
    private $label;

    public function __construct($value, string $label) {
        $this->value = $value;
        $this->label = $label;
    }

    public function getValue() {
        return $this->value;
    }

    public function setValue($value) {
        $this->value = $value;
    }

    public function getLabel(): string {
        return $this->label;
    }

    public function setLabel(string $label) {
        $this->label = $label;
    }

    public function jsonSerialize() {
        return [
                'value' => $this->value,
                'label' => $this->label,
            ];
    }
}