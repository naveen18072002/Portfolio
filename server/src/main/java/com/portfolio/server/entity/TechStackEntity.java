package com.portfolio.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TECH_STACK")
public class TechStackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NAME", length = 100)
    private String name;

    @Column(name = "ICON_CLASS", length = 200)
    private String iconClass;

    @Column(name = "DISPLAY_ORDER")
    private Integer displayOrder;

    public TechStackEntity() {}

    public TechStackEntity(String name, String iconClass, Integer displayOrder) {
        this.name = name;
        this.iconClass = iconClass;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIconClass() { return iconClass; }
    public void setIconClass(String iconClass) { this.iconClass = iconClass; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
