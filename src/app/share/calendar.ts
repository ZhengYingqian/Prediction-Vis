import * as d3 from 'd3';

export class Calendar {
    cellSize = 17;
    width = 954;
    weekday;

    constructor(weekday) {
        this.weekday = weekday;
    }

    chart = (data) => {
        const timeWeek = this.weekday === 'sunday' ? d3.utcSunday : d3.utcMonday;
        const formatMonth = d3.utcFormat('%b');
        const formatDay = d => 'SMTWTFS'[d.getUTCDay()];
        const formatDate = d3.utcFormat('%x');
        const format = d3.format('+.2%');
        const countDay = this.weekday === 'sunday' ? d => new Date(d).getUTCDay() : d => (new Date(d).getUTCDay() + 6) % 7;
        const height = this.cellSize * (this.weekday === 'weekday' ? 7 : 9);
        const max = d3.quantile(data.map(d => Math.abs(d.value)).sort(d3.ascending), 0.995);
        const color =  d3.scaleSequential(d3.interpolatePiYG).domain([-max, +max]);
        // const legend({color, title: "Daily change", tickFormat: "+%"})

        const pathMonth = (t) => {
            const n = this.weekday === 'weekday' ? 5 : 7;
            const d = Math.max(0, Math.min(n, countDay(t)));
            const w = timeWeek.count(d3.utcYear(t), t);
            return `${d === 0 ? `M${w * this.cellSize},0`
                : d === n ? `M${(w + 1) * this.cellSize},0`
                    : `M${(w + 1) * this.cellSize},0V${d * this.cellSize}H${w * this.cellSize}`}V${n * this.cellSize}`;
        };

        const years = d3.nest()
            .key(d => new Date(d.date).getUTCFullYear())
            .entries(data)
            .reverse();

        const svg = d3.select('.calendar').append('svg')
            .attr('viewBox', [0, 0, this.width, height * years.length])
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10);

        const year = svg.selectAll('g')
            .data(years)
            .join('g')
            .attr('transform', (d, i) => `translate(40,${height * i + this.cellSize * 1.5})`);

        year.append('text')
            .attr('x', -5)
            .attr('y', -5)
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'end')
            .text(d => d.key);

        year.append('g')
            .attr('text-anchor', 'end')
            .selectAll('text')
            .data((this.weekday === 'weekday' ? d3.range(2, 7) : d3.range(7)).map(i => new Date(1995, 0, i)))
            .join('text')
            .attr('x', -5)
            .attr('y', d => (countDay(d) + 0.5) * this.cellSize)
            .attr('dy', '0.31em')
            .text(formatDay);

        year.append('g')
            .selectAll('rect')
            .data(d => d.values)
            .join('rect')
            .attr('width', this.cellSize - 1)
            .attr('height', this.cellSize - 1)
            .attr('x', d => {
              return timeWeek.count(d3.utcYear(d.date), d.date) * this.cellSize + 0.5;
            })
            .attr('y', d => countDay(d.date) * this.cellSize + 0.5)
            .attr('fill', (d) => color(d.value))
            .append('title')
            .text(d => `${formatDate(d.date)}: ${format(d.value)}`);

        const month = year.append('g')
            .selectAll('g')
            .data(d => d3.utcMonths(d3.utcMonth(d.values[0].date), d.values[d.values.length - 1].date))
            .join('g');

        month.filter((d, i) => i).append('path')
            .attr('fill', 'none')
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .attr('d', pathMonth);

        month.append('text')
            .attr('x', d => timeWeek.count(d3.utcYear(d.date), timeWeek.ceil(d)) * this.cellSize + 2)
            .attr('y', -5)
            .text(formatMonth);

        return svg.node();
    }
}
