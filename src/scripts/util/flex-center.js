// flex-center fallback for browsers that don't support flexbox
let els = document.querySelectorAll(".no-flexbox .flex-center-children");
for (let i=0; i	< els.length; ++i){
	for (let j=0; j < els[i].children.length; j++){
		let parent = els[i];
		let child = parent.children[j];
		let childHeight = parseFloat(window.getComputedStyle(child).height);
		let parentHeight =  getInnerHeight(parent);
		child.style.marginTop = ((parentHeight - childHeight) / 2) + "px";
	}
}

function getInnerHeight(el){
	var computedStyle = getComputedStyle(el);
	var totalElHeight = el.clientHeight;
	var elPadding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
	return totalElHeight - elPadding;
}
