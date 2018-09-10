<?php
require_once 'AbstractRepository.php';
require_once '../Model/Widget.php';


class WidgetRepository extends AbstractRepository {
    
    public function getWidgets(): Array {
        $sql = "(select count(*) as value, 'Móviles Activos' as  description, 'icon-speedometer' as iconClass, 'primary' as mainColorClass, 'false' as hasProgressBar, '80' as progressBarValue from moviles where activo=1)";
        $sql .= "UNION ";
        $sql .= "(select concat(COUNT(DISTINCT movil),' - ', round(COUNT(DISTINCT movil)*100/(select count(*) from moviles where activo=1),2),'%') as value, 'En Taller' as  description, 'icon-wrench' as iconClass, 'success' as mainColorClass, 'true' as hasProgressBar, round(COUNT(DISTINCT movil)*100/(select count(*) from moviles where activo=1),2) as progressBarValue from tickets where en_taller=1 and estado <> 'CERRADO' and estado <> 'CANCELADO')";
        $sql .= "UNION ";
        $sql .= "(select concat(COUNT(DISTINCT movil),' - ', round(COUNT(DISTINCT movil)*100/(select count(*) from moviles where activo=1),2),'%') as value, 'Listos para Retirar' as  description, 'icon-like' as iconClass, 'warning' as mainColorClass, 'true' as hasProgressBar, round(COUNT(DISTINCT movil)*100/(select count(*) from moviles where activo=1),2) as progressBarValue from tickets where estado='LISTO PARA RETIRAR')";
        $sql .= "UNION ";
        $sql .= "(select '0' as value, 'Tickets Presupuestados' as  description, 'la-file-text' as iconClass, 'danger' as mainColorClass, 'false' as hasProgressBar, '0' as progressBarValue from moviles where activo=1)";


        $db = $this->connect();
        $result = $db->query($sql);
        $items = $result->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return null;
        }

        $widgets = Array();
        foreach ($items as $item) {
            $widget = new Widget();
            $widget->setValue($item->value);
            $widget->setDescription($item->description);
            $widget->setIconClass($item->iconClass);
            $widget->setMainColorClass($item->mainColorClass);
            $widget->setHasProgressBar($item->hasProgressBar);
            $widget->setProgressBarValue($item->progressBarValue);

            array_push($widgets, $widget);
        }

        $this->disconnect();
        return $widgets;
    }

    
}
