<?php

class Widget implements JsonSerializable
{
    
    private $value;
    private $description;
    private $iconClass;
    private $mainColorClass;
    private $hasProgressBar;
    private $progressBarValue;

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(?string $value): void
    {
        $this->value = $value;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    public function getIconClass(): ?string
    {
        return $this->iconClass;
    }

    public function setIconClass(?string $iconClass): void
    {
        $this->iconClass = $iconClass;
    }
    public function getMainColorClass(): ?string
    {
        return $this->mainColorClass;
    }

    public function setMainColorClass(?string $mainColorClass): void
    {
        $this->mainColorClass = $mainColorClass;
    }

    public function getHasProgressBar(): ?string
    {
        return $this->hasProgressBar;
    }

    public function setHasProgressBar(?string $hasProgressBar): void
    {
        $this->hasProgressBar = $hasProgressBar;
    }


    public function getProgressBarValue(): ?string
    {
        return $this->progressBarValue;
    }

    public function setProgressBarValue(?string $progressBarValue): void
    {
        $this->progressBarValue = $progressBarValue;
    }


    public function jsonSerialize()
    {
        return
            [
                'value' => $this->value,
                'description' => $this->description,
		        'iconClass' => $this->iconClass,
                'mainColorClass' => $this->mainColorClass,
                'hasProgressBar' => $this->hasProgressBar,
                'progressBarValue' => $this->progressBarValue
            ];
    }

}
