package com.portfolio.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "STAT_SUMMARIES")
public class StatSummaryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ICON", length = 100)
    private String icon;

    @Column(name = "STAT_VALUE", length = 100)
    private String value;

    @Column(name = "LABEL", length = 200)
    private String label;

    @Lob
    @Column(name = "STAT_TEXT", columnDefinition = "TEXT")
    private String text;

    @Column(name = "DISPLAY_ORDER")
    private Integer displayOrder;

    public StatSummaryEntity() {}

    public StatSummaryEntity(String icon, String value, String label, String text, Integer displayOrder) {
        this.icon = icon;
        this.value = value;
        this.label = label;
        this.text = text;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
